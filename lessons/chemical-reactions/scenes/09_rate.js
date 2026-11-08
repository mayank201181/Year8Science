/* Chapter 9, How fast? The rate of reaction.
   A firework is over in a flash, a car rusts for years -> a speed dial: rate = how fast
   -> SHOWPIECE: a particle arena where gentle bumps bounce off and hard hits flash and join into products
   -> a Bunsen heats it: faster, harder, more flashes -> more particles pour in: more collisions
   -> a lump beside the same mass of powder: far more surface to hit -> marble chip vs powder in acid,
   with a gas graph that levels off at the same height -> an energy hill and the gold catalyst's easier route
   -> the four factor tiles group under "more collisions", "harder collisions" and "easier route".
   The arena is a small hard-disc simulation run once at build time (fixed seed), then played back by time. */
scene('rate', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const CA = C.water, CAd = C.waterDk, CB = C.heat, CBd = C.heatDk;      // the two reactant particles
  const fade = (t, t0, d) => P(t, t0, d === undefined ? 0.4 : d, linear);
  const smooth = p => p * p * (3 - 2 * p);

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const dot = (parent, r, col, dk) => E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.1) }, parent);
  /* side view of a small car, wheels on y = 0, facing right; g.setRust(0..1) spreads rust patches */
  function carArt(parent, seed) {
    const g = G(parent);
    const body = 'M-178,-36 Q-180,-74 -148,-80 L-104,-84 Q-82,-128 -48,-134 L56,-134 Q88,-130 112,-86 L156,-80 Q182,-74 180,-44 L180,-36 Q180,-24 168,-24 L-168,-24 Q-178,-24 -178,-36 Z';
    E('path', { d: body, fill: ball('#7FB2E3', '#2F5E8E'), stroke: '#CFE3F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const rustG = G(g, { 'clip-path': _clipUrl(body) });
    const rr = rng(seed || 5), patches = [];
    for (let i = 0; i < 18; i++) {
      const x = -170 + rr() * 340, y = -128 + rr() * 100, rx = 10 + rr() * 22;
      patches.push({ el: E('ellipse', { cx: x, cy: y, rx, ry: rx * (0.55 + rr() * 0.5), fill: rr() < 0.55 ? RX.rust : RX.rustLt }, rustG), th: rr() * 0.85 });
    }
    E('path', { d: 'M-86,-86 Q-70,-120 -44,-124 L-6,-124 L-6,-86 Z', fill: '#BFE6F7', opacity: 0.85 }, g);
    E('path', { d: 'M6,-86 L6,-124 L50,-124 Q76,-120 96,-86 Z', fill: '#BFE6F7', opacity: 0.85 }, g);
    E('rect', { x: 166, y: -70, width: 12, height: 14, rx: 4, fill: C.energy }, g);
    E('rect', { x: -180, y: -68, width: 10, height: 14, rx: 4, fill: C.bad }, g);
    [-110, 112].forEach(x => { E('circle', { cx: x, cy: -30, r: 30, fill: '#1B2730', stroke: '#56636E', 'stroke-width': 4 }, g); E('circle', { cx: x, cy: -30, r: 12, fill: '#B9C6D2' }, g); });
    g.setRust = v => patches.forEach(p => { const k = clamp((v - p.th) * 6); if (p.k !== k) { p.k = k; op(p.el, k * 0.95); } });
    g.setRust(0);
    return g;
  }
  /* a firework burst of n rays around (0,0); g.upd(t, t0) plays it from t0 */
  function burst(parent, n, len, cols, seed) {
    const g = G(parent), rr = rng(seed), rays = [];
    for (let i = 0; i < n; i++) {
      const col = cols[i % cols.length];
      rays.push({ a: (i + rr() * 0.35) / n * TAU, l: len * (0.78 + rr() * 0.3), ln: E('line', { stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, g), dt: E('circle', { r: 6, fill: col }, g) });
    }
    const core = spark(g, len * 0.22, { seed });
    g.upd = (t, t0) => {
      const u = (t - t0) / 1.7;
      if (u <= 0 || u >= 1) { op(g, 0); return; }
      op(g, 1);
      const d = easeOut(clamp(u / 0.4)), k = 1 - P(u, 0.4, 0.6, linear), drop = 80 * u * u;
      rays.forEach(o => {
        const ca = Math.cos(o.a), sa = Math.sin(o.a), r1 = o.l * d, r0 = Math.max(0, r1 - o.l * (0.5 - 0.3 * u));
        attr(o.ln, 'x1', ca * r0); attr(o.ln, 'y1', sa * r0 + drop * 0.5); attr(o.ln, 'x2', ca * r1); attr(o.ln, 'y2', sa * r1 + drop);
        o.ln.style.opacity = (k * 0.9).toFixed(3);
        attr(o.dt, 'cx', ca * r1); attr(o.dt, 'cy', sa * r1 + drop); o.dt.style.opacity = k.toFixed(3);
      });
      tr(core, 0, 0, Math.max(0.01, (1 - u) * pop(clamp(u * 6)))); core.upd(t);
    };
    g.upd(-1, 0);
    return g;
  }
  /* a still starburst icon (the firework at the dial's fast end) */
  function starIcon(parent, r) {
    const g = G(parent), cols = [C.energy, C.oxygen, C.water, C.lactic];
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; E('line', { x1: Math.cos(a) * r * 0.35, y1: Math.sin(a) * r * 0.35, x2: Math.cos(a) * r, y2: Math.sin(a) * r, stroke: cols[i % 4], 'stroke-width': 5, 'stroke-linecap': 'round' }, g); }
    E('circle', { r: r * 0.2, fill: C.energyLt }, g);
    return g;
  }

  /* ================= A. over in a flash / crawl for years ================= */
  const A = G(root);
  const FWX = 300, FWY = 300;
  const trail = E('line', { x1: FWX, y1: 560, x2: FWX, y2: 560, stroke: C.energyLt, 'stroke-width': 4, 'stroke-linecap': 'round' }, A);
  const rocket = G(A);
  E('line', { x1: 0, y1: 10, x2: 0, y2: 66, stroke: '#C9A26B', 'stroke-width': 4, 'stroke-linecap': 'round' }, rocket);
  E('rect', { x: -9, y: -22, width: 18, height: 40, rx: 4, fill: ball('#FF7A8A', C.bad), stroke: '#FFD0D6', 'stroke-width': 2 }, rocket);
  E('path', { d: 'M-11,-20 L0,-40 L11,-20 Z', fill: C.energy, stroke: C.energyLt, 'stroke-width': 2, 'stroke-linejoin': 'round' }, rocket);
  const bMain = burst(A, 16, 150, [C.energy, C.oxygen, C.water, C.lactic], 3); tr(bMain, FWX, FWY);
  const bSmall = burst(A, 12, 82, [C.lactic, C.energy, C.good], 9); tr(bSmall, FWX - 120, FWY - 60);
  const fwName = T(A, FWX, 600, 'explosion', { size: 36, weight: 700, anchor: 'middle' });
  const fwChip = chip(A, 'over in a flash', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(fwChip, FWX, 652);
  const CARX = 890, CARY = 470;
  const tl = G(A);
  E('line', { x1: 700, y1: 520, x2: 1080, y2: 520, stroke: C.line, 'stroke-width': 6, 'stroke-linecap': 'round' }, tl);
  { let d = ''; for (let i = 0; i <= 9; i++) d += `M${(700 + i * 380 / 9).toFixed(1)},512 L${(700 + i * 380 / 9).toFixed(1)},528 `; E('path', { d, stroke: C.muted, 'stroke-width': 3 }, tl); }
  const tlFill = E('line', { x1: 700, y1: 520, x2: 700, y2: 520, stroke: RX.rustLt, 'stroke-width': 6, 'stroke-linecap': 'round' }, tl);
  const yearChip = chip(tl, 'year 10', { size: 28, fill: C.card, stroke: RX.rustLt, w: 140 }); tr(yearChip, CARX, 296);
  const tlDot = E('circle', { cx: 700, cy: 520, r: 10, fill: RX.rustLt, stroke: C.bg0, 'stroke-width': 3 }, tl);
  const carName = T(A, CARX, 600, 'rusting', { size: 36, weight: 700, anchor: 'middle' });
  const carChip = chip(A, 'takes years', { size: 28, fill: C.card2, stroke: RX.rustLt, color: RX.rustLt }); tr(carChip, CARX, 652);
  const carG = G(root);
  const car = carArt(carG, 5);

  /* ================= B. rate = how fast: a speed dial ================= */
  const B = G(root);
  const DX = 600, DY = 470, DR = 200;
  E('path', { d: `M${DX - DR},${DY} A${DR},${DR} 0 0 1 ${DX + DR},${DY}`, fill: 'none', stroke: linGrad(C.water, C.heat), 'stroke-width': 30, 'stroke-linecap': 'round' }, B);
  { let d = ''; for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI, r2 = DR - (i % 5 ? 46 : 58); d += `M${(DX + Math.cos(a) * (DR - 30)).toFixed(1)},${(DY + Math.sin(a) * (DR - 30)).toFixed(1)} L${(DX + Math.cos(a) * r2).toFixed(1)},${(DY + Math.sin(a) * r2).toFixed(1)} `; }
    E('path', { d, stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round' }, B); }
  const needle = G(B);
  E('path', { d: 'M-14,-9 L168,0 L-14,9 Z', fill: C.ink, stroke: C.bg0, 'stroke-width': 2, 'stroke-linejoin': 'round' }, needle);
  E('circle', { cx: DX, cy: DY, r: 20, fill: C.card2, stroke: C.ink, 'stroke-width': 4 }, B);
  T(B, DX - DR, DY + 58, 'slow', { size: 30, weight: 700, anchor: 'middle', fill: C.water });
  T(B, DX + DR, DY + 58, 'fast', { size: 30, weight: 700, anchor: 'middle', fill: C.heat });
  const fastIcon = G(B); starIcon(fastIcon, 46); tr(fastIcon, DX + DR + 128, DY - 30);
  const dialTitle = rich(B, DX, 190, [['rate', C.energy, 800], ' = how fast'], { size: 58, weight: 700, anchor: 'middle' });
  const flowG = G(B);
  const cR = chip(flowG, 'reactants', { size: 30, fill: '#123F52', stroke: C.water }); tr(cR, DX - 150, 640);
  const cP = chip(flowG, 'products', { size: 30, fill: '#163F2A', stroke: C.good }); tr(cP, DX + 150, 640);
  const flowArrow = arrow(flowG, DX - 150 + cR.w / 2 + 14, 640, DX + 150 - cP.w / 2 - 14, 640, { color: C.ink, width: 6 });

  /* ================= C. the particle arena ================= */
  const AX = 80, AY = 140, AW = 680, AH = 360, PR = 14;
  const GAP0 = 470, GAP1 = 620;                       // opening in the lid, arena coordinates
  const arenaG = G(root);
  const heatGlow = E('ellipse', { cx: AX + AW / 2, cy: AY + AH + 30, rx: 330, ry: 120, fill: glow(C.heat) }, arenaG);
  const burner = bunsen(arenaG, 0.8); tr(burner, AX + AW / 2, 696);
  const arena = G(arenaG); tr(arena, AX, AY);
  E('rect', { x: -8, y: -8, width: AW + 16, height: AH + 16, rx: 18, fill: 'rgba(200,230,250,0.05)' }, arena);
  E('path', { d: `M${GAP0},-8 L10,-8 Q-8,-8 -8,10 L-8,${AH - 10} Q-8,${AH + 8} 10,${AH + 8} L${AW - 10},${AH + 8} Q${AW + 8},${AH + 8} ${AW + 8},${AH - 10} L${AW + 8},10 Q${AW + 8},-8 ${AW - 10},-8 L${GAP1},-8`, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, arena);
  const lid = G(arena);
  E('rect', { x: GAP0 - 6, y: -14, width: GAP1 - GAP0 + 12, height: 12, rx: 6, fill: '#8FA3B3', stroke: '#CFE7F5', 'stroke-width': 2 }, lid);
  E('rect', { x: (GAP0 + GAP1) / 2 - 16, y: -28, width: 32, height: 16, rx: 5, fill: '#8FA3B3', stroke: '#CFE7F5', 'stroke-width': 2 }, lid);
  const pourG = G(arenaG);
  const pourArrow = arrow(pourG, AX + (GAP0 + GAP1) / 2, 44, AX + (GAP0 + GAP1) / 2, 110, { color: C.ink, width: 6 });
  T(pourG, AX + GAP1 + 26, 86, 'more particles', { size: 28, weight: 700, fill: C.ink });

  /* --- the simulation: hard discs in a box; an A+B hit reacts only if it is hard enough (and the
     reaction budget for this moment allows it), merging the pair into one product that keeps moving --- */
  const SIM_T0 = at('collide') - 0.5, SIM_T1 = at('surface') + 0.3, HOT = 1.7, SIM_HZ = 50;
  const kHeat = t => 1 + (HOT - 1) * (P(t, at('temp') + 0.4, 1.5) - P(t, end('temp') - 0.15, 1.0));
  const tOn = mid('collide', 0.36), tHot = at('temp') + 1.2, tCool = end('temp'), tConc = mid('conc', 0.3);
  const budget = t => {
    if (t < tOn) return 0;
    let b = 1 + (Math.min(t, tHot) - tOn) * 0.45;
    if (t > tHot) b += (Math.min(t, tCool) - tHot) * 1.3;
    if (t > tCool) b += (Math.min(t, tConc) - tCool) * 0.45;
    if (t > tConc) b += (t - tConc) * 1.5;
    return Math.floor(b);
  };
  const SIM = (() => {
    const R = rng(7), rp = PR * 1.6, dt = 1 / SIM_HZ, sigma = 85, vth = 150, n0 = 36, nAdd = 32;
    const N = n0 + nAdd;
    const x = new Float64Array(N), y = new Float64Array(N), vx = new Float64Array(N), vy = new Float64Array(N);
    const m = new Float64Array(N), rad = new Float64Array(N), kind = new Int8Array(N), st = new Int8Array(N);
    const tIn = new Float64Array(N), tRx = new Float64Array(N).fill(Infinity), mate = new Int32Array(N).fill(-1), ang0 = new Float64Array(N);
    const cols = Math.ceil(Math.sqrt(n0 * AW / AH)), rows = Math.ceil(n0 / cols), cells = [];
    for (let i = 0; i < cols * rows; i++) cells.push(i);
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const q = cells[i]; cells[i] = cells[j]; cells[j] = q; }
    const spd = () => sigma * Math.sqrt(-2 * Math.log(1 - R() * 0.999));
    for (let k = 0; k < n0; k++) {
      const cell = cells[k], a = R() * TAU, s = spd();
      x[k] = (cell % cols + 0.5) * AW / cols + (R() - 0.5) * 8; y[k] = (Math.floor(cell / cols) + 0.5) * AH / rows + (R() - 0.5) * 8;
      vx[k] = Math.cos(a) * s; vy[k] = Math.sin(a) * s; m[k] = 1; rad[k] = PR; kind[k] = k % 2; st[k] = 2; tIn[k] = -1e6;
    }
    const ER = rng(107), p0 = mid('conc', 0.12), p1 = mid('conc', 0.42);
    for (let q = 0; q < nAdd; q++) {
      const k = n0 + q; x[k] = GAP0 + 12 + ER() * (GAP1 - GAP0 - 24); y[k] = -PR - 2; vx[k] = (ER() - 0.5) * 80; vy[k] = 170 + ER() * 60;
      m[k] = 1; rad[k] = PR; kind[k] = q % 2; st[k] = 0; tIn[k] = p0 + q * (p1 - p0) / nAdd;
    }
    const steps = Math.ceil((SIM_T1 - SIM_T0) / dt), F = new Float32Array((steps + 1) * N * 2), rx = [], bumps = [];
    const CS = 2 * rp + 2, GX = Math.ceil(AW / CS) + 1, GY = Math.ceil((AH + 4 * PR) / CS) + 1;
    const head = new Int32Array(GX * GY), next = new Int32Array(N);
    let made = 0;
    for (let s = 0; s <= steps; s++) {
      const t = SIM_T0 + s * dt;
      for (let i = 0; i < N; i++) {
        if (st[i] === 0 && t >= tIn[i]) st[i] = 1;
        if (st[i] !== 1 && st[i] !== 2) continue;
        x[i] += vx[i] * dt; y[i] += vy[i] * dt;
        const ri = rad[i];
        if (x[i] < ri) { x[i] = ri; vx[i] = Math.abs(vx[i]); }
        if (x[i] > AW - ri) { x[i] = AW - ri; vx[i] = -Math.abs(vx[i]); }
        if (st[i] === 1 && y[i] > ri + 1) st[i] = 2;
        if (st[i] === 2 && y[i] < ri) { y[i] = ri; vy[i] = Math.abs(vy[i]); }
        if (y[i] > AH - ri) { y[i] = AH - ri; vy[i] = -Math.abs(vy[i]); }
      }
      head.fill(-1);
      for (let i = 0; i < N; i++) {
        if (st[i] !== 1 && st[i] !== 2) continue;
        const c = clamp(Math.floor((y[i] + 2 * PR) / CS), 0, GY - 1) * GX + clamp(Math.floor(x[i] / CS), 0, GX - 1);
        next[i] = head[c]; head[c] = i;
      }
      const allowed = budget(t);
      for (let gy = 0; gy < GY; gy++) for (let gx = 0; gx < GX; gx++) {
        for (let i = head[gy * GX + gx]; i >= 0; i = next[i]) {
          for (let oy = 0; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
            if ((oy === 0 && ox < 0) || gx + ox < 0 || gx + ox >= GX || gy + oy >= GY) continue;
            for (let j = (oy === 0 && ox === 0) ? next[i] : head[(gy + oy) * GX + gx + ox]; j >= 0; j = next[j]) {
              if (st[i] === 3 || st[j] === 3) continue;
              const dx = x[j] - x[i], dy = y[j] - y[i], rr = rad[i] + rad[j], d2 = dx * dx + dy * dy;
              if (d2 >= rr * rr || d2 < 1e-9) continue;
              const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, ia = 1 / m[i], ib = 1 / m[j], ov = (rr - d) / (ia + ib);
              x[i] -= nx * ov * ia; y[i] -= ny * ov * ia; x[j] += nx * ov * ib; y[j] += ny * ov * ib;
              const vn = (vx[j] - vx[i]) * nx + (vy[j] - vy[i]) * ny;
              if (vn >= 0) continue;
              const ab = kind[i] + kind[j] === 1;
              if (ab && -vn > vth && made < allowed) {
                const h = kind[i] === 0 ? i : j, g = h === i ? j : i, mx = (x[i] + x[j]) / 2, my = (y[i] + y[j]) / 2;
                rx.push({ t, x: mx, y: my, hard: -vn });
                ang0[h] = Math.atan2(y[g] - y[h], x[g] - x[h]);
                vx[h] = (vx[i] + vx[j]) / 2; vy[h] = (vy[i] + vy[j]) / 2; x[h] = mx; y[h] = my;
                kind[h] = 2; m[h] = 2; rad[h] = rp; tRx[h] = t; mate[h] = g; tRx[g] = t; mate[g] = h; st[g] = 3;
                made++;
                continue;
              }
              const jimp = -2 * vn / (ia + ib);
              vx[i] -= jimp * ia * nx; vy[i] -= jimp * ia * ny; vx[j] += jimp * ib * nx; vy[j] += jimp * ib * ny;
              if (ab) bumps.push({ t, x: (x[i] + x[j]) / 2, y: (y[i] + y[j]) / 2, hard: -vn });
            }
          }
        }
      }
      // thermostat: the mean kinetic energy follows the burner (k = 1 cool, HOT when heated)
      let ke = 0, n = 0;
      for (let i = 0; i < N; i++) if (st[i] === 2) { ke += 0.5 * m[i] * (vx[i] * vx[i] + vy[i] * vy[i]); n++; }
      const kk = kHeat(t);
      if (n && ke > 0) { const f = lerp(1, Math.sqrt(sigma * sigma * kk * kk / (ke / n)), 0.08); for (let i = 0; i < N; i++) if (st[i] === 2) { vx[i] *= f; vy[i] *= f; } }
      const o = s * N * 2;
      for (let i = 0; i < N; i++) { const q = st[i] === 3 ? mate[i] : i; F[o + 2 * i] = x[q]; F[o + 2 * i + 1] = y[q]; }
    }
    return { F, N, nF: steps + 1, rx, bumps, tIn, tRx, mate, ang0, host: Array.from(kind, k => k === 2) };
  })();
  const parts = [];
  for (let i = 0; i < SIM.N; i++) parts.push(dot(arena, PR, i % 2 ? CB : CA, i % 2 ? CBd : CAd));
  // particles that enter later must alternate kinds too: kind = index parity for both groups (n0 is even)
  const omega = parts.map((_, i) => ((i * 37) % 11 - 5) * 0.12);
  const SPK = [];
  for (let k = 0; k < 8; k++) SPK.push(spark(arena, 18, { seed: k }));
  // the two highlighted moments of the collide line: a gentle bump, then the first reaction
  const w0 = mid('collide', 0.12), w1 = mid('collide', 0.26);
  const okPos = e => e.x > 80 && e.x < AW - 80 && e.y > 70 && e.y < AH - 50;
  const gentle = SIM.bumps.find(e => e.t > w0 && e.t < w1 && e.hard > 30 && e.hard < 120 && okPos(e)) || SIM.bumps.find(e => e.t > w0 && okPos(e)) || { t: w0, x: AW / 2, y: AH / 2 };
  const firstRx = SIM.rx[0] || { t: tOn, x: AW / 2, y: AH / 2, hard: 200 };
  function callout(text, col) {
    const g = G(arena);
    const ring = E('circle', { r: 20, fill: 'none', stroke: col, 'stroke-width': 4 }, g);
    const c = chip(g, text, { size: 26, fill: 'rgba(10,27,39,0.88)', stroke: col, color: col });
    g.ring = ring; g.chip = c;
    return g;
  }
  const calG = callout('gentle bump: bounce', C.ink), calR = callout('hard hit: react!', C.energy);
  const placeCallout = (g, e) => { tr(g, e.x, e.y); const w = g.chip.w; tr(g.chip, clamp(e.x, w / 2 + 6, AW - w / 2 - 6) - e.x, e.y > 120 ? -58 : 58); };
  placeCallout(calG, gentle); placeCallout(calR, firstRx);
  // counters under the arena
  const made = chip(arenaG, 'products made: 00', { size: 28, fill: C.card, stroke: C.line });
  tr(made, AX + made.w / 2, 548);
  const madeTxt = made.label;
  const tempG = G(arenaG); tr(tempG, AX + AW - 150, 548);
  E('rect', { x: -60, y: -27, width: 210, height: 54, rx: 27, fill: C.card, stroke: C.line, 'stroke-width': 3 }, tempG);
  const thm = thermometer(tempG, 50, C.bad); tr(thm, -32, 9, 0.5);
  const tempTxt = T(tempG, 2, 11, '20 °C', { size: 30, weight: 700 });

  /* --- the collision idea: a key beside the arena --- */
  const key = G(root);
  card(key, 820, 140, 340, 420, { fill: C.card, stroke: C.line });
  const keyRows = [0, 1, 2].map(() => G(key));
  { // gentle bump
    const g = keyRows[0], a = dot(g, 15, CA, CAd), b = dot(g, 15, CB, CBd);
    attr(a, 'cx', 862); attr(a, 'cy', 214); attr(b, 'cx', 896); attr(b, 'cy', 214);
    arrow(g, 846, 196, 826, 180, { color: C.muted, width: 4, head: 11 }); arrow(g, 912, 196, 932, 180, { color: C.muted, width: 4, head: 11 });
    T(g, 956, 206, 'gentle bump:', { size: 26, weight: 600, fill: C.muted }); T(g, 956, 240, 'bounce off', { size: 28, weight: 700 });
  }
  { // hard hit
    const g = keyRows[1], sp = spark(g, 16, { seed: 4 }); tr(sp, 879, 310);
    const a = dot(g, 15, CA, CAd), b = dot(g, 15, CB, CBd);
    attr(a, 'cx', 866); attr(a, 'cy', 314); attr(b, 'cx', 892); attr(b, 'cy', 314);
    keyRows[1].sp = sp;
    T(g, 956, 306, 'hard hit:', { size: 26, weight: 600, fill: C.muted }); T(g, 956, 340, 'they react!', { size: 28, weight: 700, fill: C.energy });
  }
  { // more or harder -> faster
    const g = keyRows[2];
    E('line', { x1: 846, y1: 386, x2: 1134, y2: 386, stroke: C.line, 'stroke-width': 2 }, g);
    T(g, 990, 428, 'more hits, or harder hits', { size: 26, weight: 600, anchor: 'middle' });
    rich(g, 990, 466, ['= a ', ['faster', C.energy, 800], ' reaction'], { size: 28, anchor: 'middle' });
  }
  const keyTitle = chip(key, 'the collision idea', { size: 30, fill: C.energy, color: C.bg0 }); tr(keyTitle, 990, 516);

  /* ================= D. surface area: a lump beside the same mass of powder ================= */
  const D = G(root);
  const SQ = 34, LX = 220, LY = 380, PX = 590, PY = 380, PG = 62;     // lump centre; powder centre and spacing
  const lumpG = G(D), powG = G(D);
  const powder = [], rr = rng(31);
  for (let k = 0; k < 16; k++) {
    const c = k % 4, r = Math.floor(k / 4);
    const home = [LX - 2 * SQ + c * SQ + SQ / 2, LY - 2 * SQ + r * SQ + SQ / 2];
    const pg = E('rect', { x: -SQ / 2, y: -SQ / 2, width: SQ, height: SQ, rx: 3, fill: '#E6ECF0', stroke: '#B7C3CC', 'stroke-width': 1.5 }, powG);
    powder.push({ g: pg, home, to: [PX + (c - 1.5) * PG + (rr() - 0.5) * 6, PY + (r - 1.5) * PG + (rr() - 0.5) * 6, (rr() - 0.5) * 24], seed: rr() });
  }
  E('rect', { x: LX - 2 * SQ, y: LY - 2 * SQ, width: 4 * SQ, height: 4 * SQ, fill: '#E6ECF0' }, lumpG);
  { let d = ''; for (let i = 1; i < 4; i++) d += `M${LX - 2 * SQ + i * SQ},${LY - 2 * SQ} V${LY + 2 * SQ} M${LX - 2 * SQ},${LY - 2 * SQ + i * SQ} H${LX + 2 * SQ} `; E('path', { d, stroke: '#B7C3CC', 'stroke-width': 1.5 }, lumpG); }
  const lumpEdge = E('rect', { x: LX - 2 * SQ, y: LY - 2 * SQ, width: 4 * SQ, height: 4 * SQ, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, lumpG);
  const crack = spark(D, 30, { seed: 6 });
  T(D, LX, 200, 'lump', { size: 32, weight: 700, anchor: 'middle' });
  T(D, LX, 232, 'only the outside', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  const powLbl = G(D);
  T(powLbl, PX, 200, 'powder', { size: 32, weight: 700, anchor: 'middle' });
  T(powLbl, PX, 232, 'the same mass, crushed', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  const mLump = meter(D, { w: 220, h: 26, color: C.energy, label: 'surface exposed', labelSize: 24 }); tr(mLump, LX - 110, 590);
  const mPow = meter(D, { w: 300, h: 26, color: C.energy, label: 'surface exposed', labelSize: 24 }); tr(mPow, PX - 150, 590);
  // acid particles: around the outside of the lump, but through every gap in the powder
  const flow = [];
  const LO2 = 2 * SQ + 11;
  for (let k = 0; k < 3; k++) flow.push({ el: dot(D, 8, CA, CAd), loop: true, ph: k / 3 });
  for (let k = 0; k < 5; k++) {
    const off = (k - 2) * PG;
    flow.push({ el: dot(D, 8, CA, CAd), x0: PX - 2.1 * PG, x1: PX + 2.1 * PG, y0: PY + off, y1: PY + off, ph: (k * 0.37) % 1 });
    flow.push({ el: dot(D, 8, CA, CAd), x0: PX + off, x1: PX + off, y0: PY - 2.1 * PG, y1: PY + 2.1 * PG, ph: (k * 0.61 + 0.2) % 1 });
  }
  const loopAt = u => {        // a point on the rectangle around the lump, u in 0..1
    const s = (u % 1) * 8 * LO2, side = Math.floor(s / (2 * LO2)), d = s - side * 2 * LO2 - LO2;
    return side === 0 ? [LX + d, LY - LO2] : side === 1 ? [LX + LO2, LY + d] : side === 2 ? [LX - d, LY + LO2] : [LX - LO2, LY - d];
  };

  /* ================= E. marble chip vs marble powder in acid ================= */
  const Eg = G(root);
  const FLY = 440, FL = [150, 360];
  FL.forEach(x => { const f = flask(Eg, 0.88, { level: 0.6, liquid: '#8FD3F0', opacity: 0.45 }); tr(f, x, FLY); });
  const chipRock = G(Eg);
  E('path', { d: 'M-24,6 L-20,-10 L-6,-16 L12,-14 L24,-4 L22,10 L4,14 L-16,13 Z', fill: ball('#EEF2F5', '#A9B6C0'), stroke: '#C9D3DA', 'stroke-width': 2, 'stroke-linejoin': 'round' }, chipRock);
  const powDots = [], pr2 = rng(41);
  for (let i = 0; i < 15; i++) powDots.push(E('circle', { cx: FL[1] - 46 + pr2() * 92, cy: FLY + 74 - pr2() * 8, r: 3 + pr2() * 2.5, fill: '#EEF2F5', stroke: '#A9B6C0', 'stroke-width': 1 }, Eg));
  const bubChip = bubbles(Eg, FL[0] - 14, FLY + 16, 28, 56, { n: 6, r: 5.5, speed: 0.32, seed: 4 });
  const bubPow = bubbles(Eg, FL[1] - 44, FLY + 16, 88, 58, { n: 18, r: 5.5, speed: 0.75, seed: 8 });
  const COL_CHIP = C.air, COL_POW = '#FFB067';
  T(Eg, FL[0], 566, 'marble chip', { size: 28, weight: 700, anchor: 'middle', fill: COL_CHIP });
  T(Eg, FL[1], 566, 'marble powder', { size: 28, weight: 700, anchor: 'middle', fill: COL_POW });
  T(Eg, (FL[0] + FL[1]) / 2, 290, 'in acid', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const GO = [485, 520], GW = 295, GH = 250;
  E('path', { d: `M${GO[0]},${GO[1] - GH - 40} L${GO[0]},${GO[1]} L${GO[0] + GW + 10},${GO[1]}`, fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Eg);
  T(Eg, GO[0] + 8, GO[1] - GH - 52, 'gas made', { size: 26, weight: 600, fill: C.muted });
  T(Eg, GO[0] + GW + 10, GO[1] + 36, 'time', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  const levelLine = E('line', { x1: GO[0], y1: GO[1] - GH, x2: GO[0] + GW, y2: GO[1] - GH, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, Eg);
  const levelLbl = T(Eg, GO[0] + GW, GO[1] - GH - 18, 'same amount of gas', { size: 26, weight: 700, anchor: 'end', fill: C.energy });
  const curveChip = E('path', { fill: 'none', stroke: COL_CHIP, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Eg);
  const curvePow = E('path', { fill: 'none', stroke: COL_POW, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Eg);
  const vPow = g => 1 - Math.pow(1 - clamp(g / 0.26), 3), vChip = g => 1 - Math.pow(1 - clamp(g / 0.9), 2.2);
  const curveD = (fn, g) => { let d = ''; const n = 40; for (let i = 0; i <= n; i++) { const q = g * i / n; d += (i ? 'L' : 'M') + (GO[0] + q * GW).toFixed(1) + ',' + (GO[1] - fn(q) * GH).toFixed(1); } return d; };

  /* ================= F. a catalyst: an easier route over the energy hill ================= */
  const Fg = G(root);
  const YR = 430, YPr = 520, HC = 440, HWd = 86, HI = 230, LO = 100, HX0 = 130, HX1 = 790;
  const hillY = (x, h) => lerp(YR, YPr, smooth(clamp((x - 300) / 290))) - h * Math.exp(-Math.pow((x - HC) / HWd, 2));
  const hillD = (h, x0, x1) => { let d = ''; for (let x = x0; x <= x1 + 0.1; x += 6) d += (d ? 'L' : 'M') + x.toFixed(1) + ',' + hillY(x, h).toFixed(1); return d; };
  arrow(Fg, 96, 600, 96, 168, { color: C.muted, width: 4, head: 14 });
  T(Fg, 112, 186, 'energy', { size: 26, weight: 600, fill: C.muted });
  const hiPath = E('path', { d: hillD(HI, HX0, HX1), fill: 'none', stroke: '#C9D6DE', 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, Fg);
  const loPath = E('path', { d: hillD(LO, 300, 590), fill: 'none', stroke: RX.gold, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '14 10' }, Fg);
  const hiLbl = T(Fg, HC, hillY(HC, HI) - 26, 'without a catalyst', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(Fg, 200, YR + 48, 'reactants', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(Fg, 725, YPr + 48, 'products', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const cat = rxCatalyst(Fg, 0.62); const CATY = hillY(HC, LO) - 4; tr(cat, HC, CATY);
  const loLbl = G(Fg);
  const loArrow = arrow(loLbl, HC, 512, HC, CATY + 34, { color: RX.gold, width: 4, head: 13 });
  T(loLbl, HC, 552, 'with a catalyst: an easier route', { size: 28, weight: 700, anchor: 'middle', fill: RX.gold });
  const keepLbl = G(Fg);
  const kt = tick(keepLbl, 13); tr(kt, 600, 262);
  T(keepLbl, 624, 272, 'the catalyst is', { size: 26, weight: 600, fill: C.ink });
  T(keepLbl, 624, 306, 'still there:', { size: 26, weight: 600, fill: C.ink });
  T(keepLbl, 624, 340, 'not used up', { size: 26, weight: 700, fill: RX.gold });
  const PAIRS = [
    { tIn: at('catalyst') - 0.1, hi: [at('catalyst') + 0.35, at('catalyst') + 1.9, 395], lo: [mid('catalyst', 0.3), mid('catalyst', 0.41), mid('catalyst', 0.52)], slot: 745 },
    { tIn: mid('catalyst', 0.36), lo: [mid('catalyst', 0.44), mid('catalyst', 0.56), mid('catalyst', 0.67)], slot: 690 },
    { tIn: mid('catalyst', 0.55), lo: [mid('catalyst', 0.62), mid('catalyst', 0.74), mid('catalyst', 0.85)], slot: 635 },
  ].map(p => { p.g = G(Fg); p.a = dot(p.g, 14, CA, CAd); p.b = dot(p.g, 14, CB, CBd); p.sp = spark(Fg, 20, { seed: 2 }); return p; });
  const pairState = (p, t) => {
    const XS = 185;
    if (p.hi && t < p.lo[0]) {
      const u = clamp((t - p.hi[0]) / (p.hi[1] - p.hi[0]));
      return { x: XS + (p.hi[2] - XS) * Math.sin(Math.PI * smooth(u)), h: HI, joined: 0 };
    }
    if (t < p.lo[1]) return { x: lerp(XS, HC, ease(clamp((t - p.lo[0]) / (p.lo[1] - p.lo[0])))), h: LO, joined: 0 };
    return { x: lerp(HC, p.slot, easeOut(clamp((t - p.lo[1]) / (p.lo[2] - p.lo[1])))), h: LO, joined: 1 };
  };

  /* ================= G. the factor tiles, then the summary ================= */
  function tileIcon(g, kind) {
    if (kind === 'temp') { const th = thermometer(g, 46, C.bad); th.set(0.85); tr(th, 0, 16, 0.62); }
    else if (kind === 'conc') {
      E('rect', { x: -26, y: -22, width: 52, height: 44, rx: 8, fill: 'rgba(200,230,250,0.06)', stroke: '#CFE7F5', 'stroke-width': 2.5 }, g);
      [[-15, -10], [-1, -12], [14, -9], [-14, 4], [0, 2], [15, 6], [-8, 13], [8, 14]].forEach(([x, y], i) => E('circle', { cx: x, cy: y, r: 5.5, fill: i % 2 ? CB : CA }, g));
    } else if (kind === 'surf') {
      [[-16, 10, 12], [2, 12, -10], [18, 9, 20], [-8, -6, -16], [10, -6, 8], [1, -21, 0]].forEach(([x, y, r]) => E('rect', { x: -7, y: -7, width: 14, height: 14, rx: 2, fill: '#E6ECF0', stroke: C.energy, 'stroke-width': 2.5, transform: `translate(${x} ${y}) rotate(${r})` }, g));
    } else { tr(rxCatalyst(g, 0.58), 0, 0); }
  }
  const TW = 270, TH = 92, SUMY = 540, HEADY = 250;
  const TILES = [
    { kind: 'temp', label: 'temperature', sub: 'faster particles', cue: () => mid('temp', 0.3), sum: [743, SUMY] },
    { kind: 'conc', label: 'concentration', sub: 'more particles', cue: () => mid('conc', 0.36), sum: [171, SUMY] },
    { kind: 'surf', label: 'surface area', sub: 'more surface', cue: () => mid('surface', 0.6), sum: [457, SUMY] },
    { kind: 'cat', label: 'catalyst', sub: 'easier route', cue: () => mid('catalyst', 0.66), sum: [1029, SUMY] },
  ].map((o, i) => {
    o.g = G(root);
    card(o.g, -TW / 2, -TH / 2, TW, TH, { fill: C.card, stroke: C.line, rx: 18 });
    o.hl = card(o.g, -TW / 2, -TH / 2, TW, TH, { fill: 'none', stroke: C.energy, sw: 4, rx: 18 });
    const ic = G(o.g); tr(ic, -TW / 2 + 42, 0); tileIcon(ic, o.kind);
    T(o.g, -TW / 2 + 82, -6, o.label, { size: 28, weight: 700 });
    T(o.g, -TW / 2 + 82, 26, o.sub, { size: 24, weight: 600, fill: C.muted });
    o.col = [990, 200 + i * 112];
    return o;
  });
  const SG = G(root);
  const sumTitle = T(SG, 600, 160, 'Every factor works through collisions', { size: 38, weight: 700, anchor: 'middle' });
  function headIcon(g, kind) {
    if (kind === 0) {
      [[-36, -14], [30, -18], [-30, 20], [36, 16]].forEach(([x, y], i) => {
        const a = dot(g, 9, CA, CAd), b = dot(g, 9, CB, CBd);
        attr(a, 'cx', x - 9); attr(a, 'cy', y); attr(b, 'cx', x + 9); attr(b, 'cy', y);
        E('path', { d: `M${x},${y - 18} L${x + 3},${y - 12} M${x - 6},${y - 15} L${x - 2},${y - 11}`, stroke: C.energy, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
        void i;
      });
    } else if (kind === 1) {
      const sp = spark(g, 24, { seed: 5 }); g.sp = sp;
      const a = dot(g, 16, CA, CAd), b = dot(g, 16, CB, CBd); attr(a, 'cx', -22); attr(b, 'cx', 22);
      E('path', { d: 'M-72,-10 L-48,-10 M-78,8 L-50,8 M48,-10 L72,-10 M50,8 L78,8', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    } else {
      const hy = (x, h) => 22 - h * Math.exp(-x * x / 500);
      let d1 = '', d2 = '';
      for (let x = -60; x <= 60; x += 6) { d1 += (d1 ? 'L' : 'M') + x + ',' + hy(x, 52).toFixed(1); d2 += (d2 ? 'L' : 'M') + x + ',' + hy(x, 24).toFixed(1); }
      E('path', { d: d1, fill: 'none', stroke: '#C9D6DE', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      E('path', { d: d2, fill: 'none', stroke: RX.gold, 'stroke-width': 4, 'stroke-dasharray': '7 6' }, g);
      tr(rxCatalyst(g, 0.3), 0, -4);
    }
  }
  const HEADS = [
    { x: 314, label: 'more collisions', cue: () => mid('sum', 0.28) },
    { x: 743, label: 'harder collisions', cue: () => mid('sum', 0.45) },
    { x: 1029, label: 'easier route', cue: () => mid('sum', 0.68) },
  ].map((h, i) => {
    h.g = G(SG); tr(h.g, h.x, 0);
    const ic = G(h.g); tr(ic, 0, HEADY); headIcon(ic, i); h.ic = ic;
    T(h.g, 0, HEADY + 80, h.label, { size: 30, weight: 700, anchor: 'middle', fill: i === 2 ? RX.gold : C.energy });
    return h;
  });
  // arrows from each tile up to its way of working; temperature gives both more and harder collisions
  const LINKS = [[171, 274, 0, 0.2], [457, 354, 0, 0.35], [700, 424, 0, 1.0], [743, 743, 1, 0.2], [1029, 1029, 2, 0.2]].map(([x0, x1, h, dl]) => {
    const a = arrow(SG, x0, SUMY - TH / 2 - 6, x1, HEADY + 98, { color: C.muted, width: 4, head: 13 });
    return { a, h, dl };
  });

  /* ================= update ================= */
  return t => {
    /* A: firework, then the rusting car */
    const aA = win(t, S.first - 0.6, at('rate') + 0.2, 0.4);
    op(A, aA);
    const T0 = at('range') + 0.15, T1 = T0 + 0.7;
    if (aA > 0) {
      const up = P(t, T0, 0.7, easeIn), ry = lerp(560, FWY, up);
      op(rocket, t < T1 ? 1 : 0); tr(rocket, FWX, ry);
      attr(trail, 'x1', FWX); attr(trail, 'x2', FWX); attr(trail, 'y1', Math.min(600, ry + 130)); attr(trail, 'y2', ry + 40);
      op(trail, t >= T0 && t < T1 + 0.2 ? 0.8 * (1 - fade(t, T1, 0.2)) : 0);
      bMain.upd(t, T1); bSmall.upd(t, T1 + 0.45);
      op(fwName, fade(t, T1 + 0.1)); const fc = P(t, T1 + 0.4, 0.5, pop); op(fwChip, clamp(fc * 2)); tr(fwChip, FWX, 652, Math.max(0.01, 0.8 + 0.2 * fc));
      const cIn = mid('range', 0.47);
      op(tl, fade(t, cIn + 0.2)); op(carName, fade(t, cIn + 0.3));
      const years = P(t, mid('range', 0.55), end('range') - mid('range', 0.55) + 0.2, linear);
      attr(tlFill, 'x2', 700 + 380 * years); op(tlFill, years > 0.005 ? 1 : 0); attr(tlDot, 'cx', 700 + 380 * years);
      _rxW(yearChip.label, 'text', 'year ' + Math.max(1, Math.ceil(years * 10)));
      op(yearChip, fade(t, mid('range', 0.55)));
      const cc = P(t, mid('range', 0.72), 0.5, pop); op(carChip, clamp(cc * 2)); tr(carChip, CARX, 652, Math.max(0.01, 0.8 + 0.2 * cc));
    }
    /* the car: rusts, then docks at the slow end of the dial */
    const aCar = Math.min(fade(t, mid('range', 0.45)), 1 - fade(t, at('collide') - 0.2));
    op(carG, aCar);
    if (aCar > 0) {
      car.setRust(P(t, mid('range', 0.55), end('range') - mid('range', 0.55) + 0.2, linear));
      const dk = P(t, at('rate') - 0.45, 0.9);
      const cp = P(t, mid('range', 0.45), 0.6, easeOut);
      tr(carG, lerp(CARX + (1 - cp) * 60, DX - DR - 118, dk), lerp(CARY, DY - 6, dk), lerp(0.92, 0.36, dk));
    }

    /* B: the speed dial */
    const aB = win(t, at('rate') - 0.2, at('collide') + 0.1, 0.4);
    op(B, aB);
    if (aB > 0) {
      const v = 0.06 + 0.88 * (P(t, at('rate') + 0.3, 0.9) * (1 - 0.55 * P(t, mid('rate', 0.62), 0.8))) + 0.04 * calm * Math.sin(t * 5);
      tr(needle, DX, DY, 1, 180 + 180 * v);
      op(dialTitle, fade(t, at('rate') + 0.1)); tr(dialTitle, 0, (1 - P(t, at('rate') + 0.1, 0.5, easeOut)) * 14);
      const fi = P(t, at('rate') + 0.6, 0.5, pop); op(fastIcon, clamp(fi * 2)); tr(fastIcon, DX + DR + 128, DY - 30, Math.max(0.01, fi), calm * t * 12);
      op(flowG, fade(t, mid('rate', 0.55))); flowArrow.set(P(t, mid('rate', 0.6), 0.7));
    }

    /* C: the arena */
    const aC = win(t, at('collide') - 0.3, at('surface') + 0.1, 0.45);
    op(arenaG, aC);
    if (aC > 0) {
      const u = clamp((t - SIM_T0) * SIM_HZ, 0, SIM.nF - 1.001), f0 = Math.floor(u), fr = u - f0, N = SIM.N, F = SIM.F;
      const o0 = f0 * N * 2, o1 = o0 + N * 2;
      for (let i = 0; i < N; i++) {
        const el = parts[i];
        if (t < SIM.tIn[i]) { op(el, 0); continue; }
        op(el, 1);
        let x = F[o0 + 2 * i] + (F[o1 + 2 * i] - F[o0 + 2 * i]) * fr, y = F[o0 + 2 * i + 1] + (F[o1 + 2 * i + 1] - F[o0 + 2 * i + 1]) * fr;
        const tr0 = SIM.tRx[i];
        if (t >= tr0) {
          const h = SIM.host[i] ? i : SIM.mate[i], th = SIM.ang0[h] + omega[h] * (t - tr0), dd = lerp(PR, PR * 0.86, P(t, tr0, 0.25)) * (SIM.host[i] ? -1 : 1);
          x += Math.cos(th) * dd; y += Math.sin(th) * dd;
        }
        attr(el, 'cx', x); attr(el, 'cy', y);
      }
      // reaction flashes: bigger for harder hits
      SPK.forEach(s => op(s, 0));
      SIM.rx.forEach((e, k) => {
        const q = (t - e.t) / 0.75;
        if (q <= 0 || q >= 1) return;
        const s = SPK[k % SPK.length], big = 0.7 + 0.6 * clamp((e.hard - 140) / 220);
        tr(s, e.x, e.y, Math.max(0.01, big * pop(clamp(q * 4)) * (1 - 0.5 * q))); op(s, 1 - P(q, 0.5, 0.5, linear)); s.upd(t);
      });
      let n = 0; for (const e of SIM.rx) if (e.t <= t) n++;
      _rxW(madeTxt, 'text', 'products made: ' + n);
      // callouts on the collide line
      [[calG, gentle], [calR, firstRx]].forEach(([g, e]) => {
        const v = win(t, e.t - 0.05, e === gentle ? Math.min(e.t + 2.2, firstRx.t - 0.15) : e.t + 2.2, 0.25);
        op(g, v);
        if (v > 0) { const q = clamp((t - e.t) / 0.6); attr(g.ring, 'r', 16 + 26 * q); op(g.ring, 1 - q); }
      });
      // burner and temperature
      const heat = (kHeat(t) - 1) / (HOT - 1);
      op(burner, Math.min(fade(t, at('temp') - 0.2), 1 - fade(t, at('surface') - 0.4)));
      burner.set(t > at('temp') + 0.25 && t < end('temp') - 0.15 ? 'blue' : 'off'); burner.upd(t * calm);
      op(heatGlow, 0.55 * heat);
      thm.set(0.15 + 0.75 * heat); _rxW(tempTxt, 'text', Math.round(20 + 40 * heat) + ' °C');
      // lid opens for the pour
      const lidOpen = P(t, mid('conc', 0.06), 0.4) * (1 - P(t, mid('conc', 0.48), 0.4));
      tr(lid, lidOpen * 150, -lidOpen * 18);
      op(pourG, win(t, mid('conc', 0.04), mid('conc', 0.55), 0.3));
      pourArrow.set(P(t, mid('conc', 0.06), 0.5));
    }
    const aKey = win(t, at('collide') + 0.1, at('temp') - 0.1, 0.4);
    op(key, aKey);
    if (aKey > 0) {
      keyRows.forEach((g, i) => { const p = P(t, mid('collide', [0.16, 0.36, 0.5][i]), 0.5, linear); op(g, p); tr(g, (1 - p) * 20, 0); });
      keyRows[1].sp.upd(t);
      const kp = P(t, mid('collide', 0.8), 0.5, pop); op(keyTitle, clamp(kp * 2)); tr(keyTitle, 990, 516, Math.max(0.01, 0.8 + 0.2 * kp));
    }

    /* D: surface area */
    const aD = win(t, at('surface') - 0.1, at('marble') + 0.1, 0.4);
    op(D, aD);
    if (aD > 0) {
      const lp = P(t, at('surface'), 0.5, pop); op(lumpG, clamp(lp * 2));
      lumpG.setAttribute('transform', `translate(${LX} ${LY}) scale(${Math.max(0.01, 0.85 + 0.15 * lp).toFixed(3)}) translate(${-LX} ${-LY})`);
      op(lumpEdge, fade(t, at('surface') + 0.5, 0.4));
      const tc = mid('surface', 0.22), cr = P(t, tc, 0.9, easeOut);
      op(powG, t > tc ? 1 : 0);
      powder.forEach(p => {
        const x = lerp(p.home[0], p.to[0], cr), y = lerp(p.home[1], p.to[1], cr) - Math.sin(cr * Math.PI) * (40 + p.seed * 50);
        tr(p.g, x, y, 1, p.to[2] * cr);
        const lit = t > mid('surface', 0.4);
        _rxW(p.g, 'stroke', lit ? C.energy : '#B7C3CC'); _rxW(p.g, 'stroke-width', lit ? 4 : 1.5);
      });
      const ck = clamp((t - tc) / 0.5); op(crack, ck > 0 && ck < 1 ? Math.sin(ck * Math.PI) : 0); tr(crack, LX + 40, LY - 10, 0.6 + 0.6 * ck); crack.upd(t);
      op(powLbl, fade(t, tc + 0.6));
      const hOn = mid('surface', 0.42), a = fade(t, hOn, 0.5);
      flow.forEach(f => {
        if (a <= 0) { op(f.el, 0); return; }
        if (f.loop) { const q = loopAt((t - hOn) * 0.16 + f.ph); attr(f.el, 'cx', q[0]); attr(f.el, 'cy', q[1]); op(f.el, a); return; }
        const q = ((t - hOn) * 0.32 + f.ph) % 1;
        attr(f.el, 'cx', lerp(f.x0, f.x1, q)); attr(f.el, 'cy', lerp(f.y0, f.y1, q));
        op(f.el, a * Math.min(1, q * 6, (1 - q) * 6));
      });
      op(mLump, fade(t, mid('surface', 0.55))); op(mPow, fade(t, mid('surface', 0.55)));
      mLump.set(0.25 * P(t, mid('surface', 0.58), 0.8)); mPow.set(P(t, mid('surface', 0.62), 1.0));
    }

    /* E: marble chip vs powder */
    const aE = win(t, at('marble') - 0.1, at('catalyst') + 0.1, 0.4);
    op(Eg, aE);
    if (aE > 0) {
      const g0 = mid('marble', 0.1), g1 = mid('marble', 0.86), g = clamp((t - g0) / (g1 - g0)), dg = 0.02;
      const vp = vPow(g), vc = vChip(g);
      const rp = clamp((vPow(g + dg) - vPow(g - dg)) / (2 * dg) / 3.2), rc = clamp((vChip(g + dg) - vChip(g - dg)) / (2 * dg) / 1.2);
      bubPow.upd(t, t > g0 ? rp : 0); bubChip.upd(t, t > g0 ? rc : 0);
      tr(chipRock, FL[0], FLY + 66 + 6 * vc, Math.max(0.01, Math.pow(1 - vc, 0.6)));
      op(chipRock, vc < 0.995 ? 1 : 0);
      powDots.forEach((d, i) => op(d, vp < (i + 1) / powDots.length ? 1 : 0));
      curvePow.setAttribute('d', curveD(vPow, Math.max(0.001, g))); curveChip.setAttribute('d', curveD(vChip, Math.max(0.001, g)));
      op(curvePow, t > g0 ? 1 : 0); op(curveChip, t > g0 ? 1 : 0);
      const lv = fade(t, mid('marble', 0.66), 0.5); op(levelLine, lv); op(levelLbl, lv);
    }

    /* F: the energy hill */
    const aF = win(t, at('catalyst') - 0.1, at('sum') + 0.1, 0.4);
    op(Fg, aF);
    if (aF > 0) {
      hiPath.setAttribute('stroke-dashoffset', (1 - P(t, at('catalyst'), 0.8)).toFixed(3));
      op(hiLbl, fade(t, at('catalyst') + 1.2));
      const tCat = PAIRS[0].hi[1] - 0.3, cp = P(t, tCat, 0.5, pop);
      op(cat, clamp(cp * 2)); tr(cat, HC, CATY, Math.max(0.01, 0.7 + 0.3 * cp));
      op(loPath, fade(t, tCat + 0.1, 0.5)); loPath.setAttribute('stroke-dashoffset', (-t * 30 * calm).toFixed(1));
      let glowK = 0;
      PAIRS.forEach(p => {
        const v = fade(t, p.tIn, 0.4);
        op(p.g, v);
        if (v <= 0) { op(p.sp, 0); return; }
        const s = pairState(p, t), y = hillY(s.x, s.h), dy = (hillY(s.x + 3, s.h) - hillY(s.x - 3, s.h)) / 6, ang = Math.atan(dy);
        const nx = Math.sin(ang), ny = -Math.cos(ang), cx = s.x + nx * 15, cy = y + ny * 15;
        const gap = s.joined ? lerp(15.5, 12.5, P(t, p.lo[1], 0.25)) : 15.5;
        attr(p.a, 'cx', cx - Math.cos(ang) * gap); attr(p.a, 'cy', cy - Math.sin(ang) * gap);
        attr(p.b, 'cx', cx + Math.cos(ang) * gap); attr(p.b, 'cy', cy + Math.sin(ang) * gap);
        const q = (t - p.lo[1]) / 0.7;
        op(p.sp, q > 0 && q < 1 ? Math.sin(q * Math.PI) : 0); tr(p.sp, HC, CATY - 30, 0.6 + 0.6 * clamp(q)); p.sp.upd(t);
        if (q > 0 && q < 1.4) glowK = Math.max(glowK, Math.sin(Math.min(1, q / 1.4) * Math.PI));
      });
      cat.set({ glow: 0.25 + 0.75 * glowK });
      op(loLbl, fade(t, mid('catalyst', 0.6))); loArrow.set(P(t, mid('catalyst', 0.62), 0.6));
      const kp = P(t, mid('catalyst', 0.47), 0.5, pop); op(keepLbl, clamp(kp * 2)); tr(kt, 600, 262, Math.max(0.01, kp));
    }

    /* G: tiles collect down the right, then regroup under the three ways */
    const sumMove = P(t, at('sum') - 0.1, 1.0);
    TILES.forEach(o => {
      const c0 = o.cue(), p = P(t, c0, 0.5, pop);
      op(o.g, clamp(p * 2));
      if (p <= 0) return;
      const x = lerp(o.col[0] + (1 - clamp(p)) * 40, o.sum[0], sumMove), y = lerp(o.col[1], o.sum[1], sumMove);
      tr(o.g, x, y, Math.max(0.01, 0.85 + 0.15 * clamp(p)));
      op(o.hl, win(t, c0, c0 + 2.2, 0.3));
    });
    const aG = fade(t, at('sum') + 0.1, 0.5);
    op(SG, aG);
    if (aG > 0) {
      op(sumTitle, fade(t, at('sum') + 0.2, 0.5));
      HEADS.forEach(h => {
        const hp = P(t, h.cue(), 0.5, pop); op(h.g, clamp(hp * 2)); tr(h.g, h.x, (1 - clamp(hp)) * 16);
        if (h.ic.sp) h.ic.sp.upd(t);
      });
      LINKS.forEach(l => { const c0 = HEADS[l.h].cue() + l.dl; l.a.set(P(t, c0, 0.6)); op(l.a, P(t, c0, 0.2, linear)); });
    }
  };
});

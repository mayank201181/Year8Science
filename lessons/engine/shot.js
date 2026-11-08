// Render frames of the lesson at chosen times and tile them into a contact sheet.
//
// usage: node shot.js PAGE.html OUTDIR SPEC [--cols 3] [--w 1280] [--name sheet]
//   SPEC is a comma list of items:
//     12.5            a global time in seconds
//     aerobic         every line of chapter "aerobic", 70% of the way through each line
//     aerobic@2       chapter "aerobic" every 2 seconds
//     aerobic.watch   one line, 70% through   (aerobic.watch:0.2 -> 20% through)
// Prints console errors/warnings from the page. Writes OUTDIR/<name>.png (the sheet)
// plus one PNG per frame. Requires ffmpeg for the sheet.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

(async () => {
  const [page_, outdir, spec, ...rest] = process.argv.slice(2);
  const opt = { cols: 3, w: 1280, name: 'sheet' };
  for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1];
  fs.mkdirSync(outdir, { recursive: true });
  // drop frames left by an earlier run, or ffmpeg would tile them into this sheet
  for (const f of fs.readdirSync(outdir)) if (/^f\d{3}\.png$/.test(f)) fs.unlinkSync(path.join(outdir, f));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +opt.w, height: 1000 }, deviceScaleFactor: 1 });
  const issues = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') issues.push(`[${m.type()}] ${m.text()}`); });
  page.on('pageerror', e => issues.push('[pageerror] ' + e.message));
  await page.goto('file://' + path.resolve(page_));
  await page.waitForFunction(() => window.__lesson && window.__lesson.ready, null, { timeout: 15000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.addStyleTag({ content: '.bigplay,.endcard{display:none!important}.caption{height:96px!important;min-height:0!important;overflow:hidden}' });
  const TL = await page.evaluate(() => window.__lesson.TL);
  const times = [];
  for (const item of spec.split(',').map(s => s.trim()).filter(Boolean)) {
    if (/^[\d.]+$/.test(item)) { times.push([+item, item]); continue; }
    const m = item.match(/^([a-z]+)(?:@([\d.]+)|\.([a-z0-9]+)(?::([\d.]+))?)?$/i);
    if (!m) throw new Error('bad spec ' + item);
    const ch = TL.chapters.find(c => c.id === m[1]);
    if (!ch) throw new Error('no chapter ' + m[1]);
    if (m[2]) { for (let t = ch.start; t < ch.end; t += +m[2]) times.push([t, `${ch.id}@${(t - ch.start).toFixed(1)}`]); }
    else if (m[3]) { const l = ch.lines.find(l => l.id === m[3]); if (!l) throw new Error('no line ' + item); const f = m[4] ? +m[4] : 0.7; times.push([l.start + f * (l.end - l.start), `${ch.id}.${l.id}`]); }
    else ch.lines.forEach(l => times.push([l.start + 0.7 * (l.end - l.start), `${ch.id}.${l.id}`]));
  }
  const files = [];
  const screen = await page.$('.screen');
  for (const [t, label] of times) {
    await page.evaluate(t => window.__lesson.renderAt(t), t);
    const f = path.join(outdir, `f${String(files.length).padStart(3, '0')}.png`);
    await screen.screenshot({ path: f });
    files.push(f);
    console.log(`${String(files.length - 1).padStart(3)}  t=${t.toFixed(2)}  ${label}`);
  }
  await browser.close();
  if (issues.length) console.log('PAGE ISSUES:\n' + [...new Set(issues)].join('\n'));
  else console.log('no console errors');
  if (files.length > 1) {
    const cols = Math.min(+opt.cols, files.length), rows = Math.ceil(files.length / cols);
    const sheet = path.join(outdir, opt.name + '.png');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(outdir, 'f%03d.png'),
      '-vf', `scale=600:-2,pad=iw+8:ih+8:4:4:color=white,tile=${cols}x${rows}:color=white`, '-frames:v', '1', sheet]);
    console.log('sheet: ' + sheet);
  }
})().catch(e => { console.error(e); process.exit(1); });

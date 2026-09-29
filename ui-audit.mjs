/* ui-audit.mjs: runs the avoid-ai-ui-tells audit (ui-tell-audit.js, copied verbatim from the skill)
   on EVERY screen of the app, at 390, 320 and 1280px, in light and dark. The skill's own runner
   only loads the first page; most of this app's controls live on other screens. */
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const chromium = (await import('@sparticuz/chromium')).default;
const audit = fs.readFileSync(new URL('./ui-tell-audit.js', import.meta.url), 'utf8').replace(/^\s*\/\/.*\n/gm, '');
const screens = {
  learn: () => { window.loadLesson(0); window.setPhase('learn'); },
  predict: () => { window.loadLesson(0); window.setPhase('predict'); },
  build: () => { window.loadLesson(0); window.setPhase('build'); window.loadTask(0); },
  solved: () => { window.loadLesson(0); window.setPhase('build'); window.loadTask(0);
    const e = document.getElementById('editor'); e.value = 'print("Good morning!")'; e.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('btnCheck').click(); },
  markup: () => { window.setMarkupLesson(0); window.setPhase('build'); },
  drawer: () => { window.loadLesson(0); window.setPhase('learn'); document.getElementById('btnLessons').click(); }
};
const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...(chromium.args || []), '--no-sandbox', '--disable-dev-shm-usage'], headless: 'shell' });
const tally = {};
let worst = 0;
try {
  for (const scheme of ['light', 'dark']) for (const w of [390, 320, 1280]) for (const [name, enter] of Object.entries(screens)) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 844, deviceScaleFactor: 1, isMobile: w < 600, hasTouch: w < 600 });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
    await page.goto('file://' + fs.realpathSync('./polyglot.html'), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(enter);
    await new Promise(r => setTimeout(r, 400));
    const r = await page.evaluate('(' + audit + ')()');
    worst = Math.max(worst, r.slopCount);
    for (const f of r.findings) { const k = 'SLOP    ' + f.id; (tally[k] ||= new Set()).add(`${name}@${w}${scheme[0]}: ${typeof f.detail === 'string' ? f.detail : JSON.stringify(f.detail)}`.slice(0, 190)); }
    for (const f of r.quality) { const k = 'QUALITY ' + f.id; (tally[k] ||= new Set()).add(`${name}@${w}${scheme[0]}: ${JSON.stringify(f.detail)}`.slice(0, 190)); }
    await page.close();
  }
} finally { await browser.close(); }
/* Documented, deliberate exceptions (PROJECT-STATE decision 39). Anything else fails the build.
   - the code-token strip: chips are as wide as their code and scroll past the edge, like keys
   - answer options and lesson rows: heights follow their content, since answers differ in length */
const ALLOWED = [/tokenbar/, /button\.tok/, /lessonList/, /qOptions/];
const unexplained = {};
for (const [k, v] of Object.entries(tally)) {
  const rest = [...v].filter(x => !ALLOWED.some(r => r.test(x.split(': ').slice(1).join(': '))));
  if (rest.length) unexplained[k] = rest;
}
console.log('\n=== UI TELL AUDIT: 6 screens x 3 widths x 2 themes ===');
console.log('worst slop-category count on any screen: ' + worst);
for (const [k, v] of Object.entries(tally)) { console.log('\n' + k + '  (' + v.size + ' screen/width combos)'); [...v].slice(0, 4).forEach(x => console.log('    ' + x)); }
console.log('\nunexplained findings: ' + (Object.keys(unexplained).length ? JSON.stringify(unexplained).slice(0, 600) : 'none'));
process.exit(worst <= 1 && !Object.keys(unexplained).length ? 0 : 1);

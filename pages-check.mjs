/* pages-check.mjs — proves the GitHub Pages copy actually works before it ships:
   served over http in real Chromium, progress persists in localStorage across a
   reload, the service worker installs, and the app still opens with the network
   cut off. Run `python3 build.py && python3 make-pages.py` first. */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
const chromium = (await import('@sparticuz/chromium')).default;

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), 'docs');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/manifest+json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); res.end('no'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise(r => server.listen(8099, r));
const URL_BASE = 'http://localhost:8099/';

const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...(chromium.args || []), '--no-sandbox', '--disable-dev-shm-usage'], headless: 'shell'
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(URL_BASE, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 500));
  ok('serve/boots', await page.evaluate(() => !!document.getElementById('lessonTitle').textContent), 'no lesson title');

  /* the manifest is a real file here, not a data: URL, and it resolves */
  ok('manifest/linked-as-file', await page.evaluate(() =>
    (document.querySelector('link[rel=manifest]') || {}).getAttribute &&
    document.querySelector('link[rel=manifest]').getAttribute('href') === 'manifest.json'), 'manifest link not a file');
  const man = await page.evaluate(async () => {
    const r = await fetch('manifest.json'); const j = await r.json();
    const icon = await fetch(j.icons[0].src);
    return { ok: r.ok, name: j.short_name, icons: j.icons.length, iconOk: icon.ok, display: j.display };
  });
  ok('manifest/fetches', man.ok && man.name === 'Step Through', JSON.stringify(man));
  ok('manifest/standalone', man.display === 'standalone', man.display);
  ok('manifest/icons-resolve', man.icons >= 2 && man.iconOk, JSON.stringify(man));

  /* progress must survive a reload through localStorage — window.storage does not exist here */
  ok('storage/no-artifact-bridge', await page.evaluate(() => !window.storage), 'window.storage unexpectedly present');
  await page.evaluate(() => {
    window.loadLesson(0); window.setPhase('build'); window.loadTask(0);
    const e = document.getElementById('editor');
    e.value = 'print("Good morning!")';
    e.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('btnCheck').click();
  });
  await new Promise(r => setTimeout(r, 400));
  ok('storage/solved-in-session', await page.evaluate(() => !!(window.S.progress['speak-1'] || {}).done), 'task not marked done');
  ok('storage/written-to-localstorage', await page.evaluate(() => !!localStorage.getItem('polyglot:v2')), 'nothing in localStorage');

  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));
  ok('storage/survives-reload', await page.evaluate(() => !!(window.S.progress['speak-1'] || {}).done), 'progress lost on reload');

  /* the service worker installs and then serves the app with no network at all */
  const swReady = await page.evaluate(() => navigator.serviceWorker.ready.then(r => !!r.active).catch(() => false));
  ok('sw/activates', swReady, 'service worker never activated');
  await new Promise(r => setTimeout(r, 600));

  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));
  ok('offline/boots-with-no-network', await page.evaluate(() =>
    !!document.getElementById('lessonTitle').textContent), 'offline reload rendered nothing');
  ok('offline/curriculum-present', await page.evaluate(() => window.LESSONS && window.LESSONS.length >= 30),
    'lessons missing offline');
  ok('offline/progress-still-there', await page.evaluate(() => !!(window.S.progress['speak-1'] || {}).done),
    'progress lost offline');
  await page.setOfflineMode(false);

  ok('console/no-errors', errors.length === 0, errors.slice(0, 3).join(' | '));
} finally {
  await browser.close();
  server.close();
}

console.log('\n=== PAGES DEPLOY CHECK (real Chromium over http) ===');
console.log('assertions passed     : ' + pass);
console.log('assertions failed     : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

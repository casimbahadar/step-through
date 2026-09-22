/* contrast-check.mjs — measures the RENDERED contrast of every visible piece of
   text on every screen, in the light theme and the dark theme, against the
   background it actually sits on. Screenshots only prove what someone looked at;
   this proves what nobody looked at. WCAG AA: 4.5:1 for body text, 3:1 for large
   text (24px, or 18.66px bold). Disabled controls are exempt, as WCAG allows. */
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const chromium = (await import('@sparticuz/chromium')).default;

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };

const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...(chromium.args || []), '--no-sandbox', '--disable-dev-shm-usage'], headless: 'shell' });

const screens = [
  ['learn', () => { window.loadLesson(0); window.setPhase('learn'); }],
  ['predict', () => { window.loadLesson(0); window.setPhase('predict'); }],
  ['build', () => { window.loadLesson(0); window.setPhase('build'); window.loadTask(0); }],
  ['stepping', () => {
    window.loadLesson(0); window.setPhase('build'); window.loadTask(0);
    const e = document.getElementById('editor');
    e.value = 'total = 0\n# add them up\nfor i in range(1, 4):\n    total = total + i\n    print(total)';
    e.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('btnRun').click();
    for (let k = 0; k < 4; k++) { const b = [...document.querySelectorAll('.stepbar .sq')].pop(); b && b.click(); }
  }],
  ['wrong-answer', () => {
    window.loadLesson(0); window.setPhase('build'); window.loadTask(0);
    const e = document.getElementById('editor');
    e.value = 'print("nope")';
    e.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('btnCheck').click();
  }],
  ['pattern-lesson', () => {
    for (const L of window.LESSONS) for (const t of L.tasks) window.S.progress[t.id] = { stars: 3, done: true };
    window.loadLesson(window.LESSONS.findIndex(L => L.id === 'bfs')); window.setPhase('learn');
  }],
  ['markup', () => { window.setMarkupLesson(0); window.setPhase('build'); }],
  ['drawer', () => { window.loadLesson(0); window.setPhase('learn'); document.getElementById('btnLessons').click(); }]
];

let measured = 0;
try {
  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage();
    await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
    await page.goto('file://' + fs.realpathSync('./polyglot.html'), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 400));

    for (const [name, enter] of screens) {
      await page.evaluate(() => { const d = document.getElementById('drawer'); if (d) d.dataset.open = 'false'; });
      await page.evaluate(enter);
      await new Promise(r => setTimeout(r, 1400));   // let the variable-change flash finish
      const res = await page.evaluate((onlyDrawer) => {
        const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
          const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
        const lum = ({ r, g, b }) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
          .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
        const ratio = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
        const bgOf = el => { for (let e = el; e; e = e.parentElement) {
          const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0.5) return c; }
          return parse(getComputedStyle(document.body).backgroundColor); };
        const out = [];
        const root = onlyDrawer ? document.getElementById('drawer') : document.body;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        while (walker.nextNode()) {
          const t = walker.currentNode; const el = t.parentElement;
          if (!el || seen.has(el) || !t.textContent.trim()) continue;
          seen.add(el);
          if (!onlyDrawer && el.closest('#drawer')) continue;
          if (el.closest('iframe, script, style, [hidden]')) continue;
          if (el.closest('button:disabled, [aria-disabled="true"]')) continue;
          const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
          const st = getComputedStyle(el);
          if (st.visibility === 'hidden' || parseFloat(st.opacity) === 0) continue;
          const size = parseFloat(st.fontSize), bold = parseInt(st.fontWeight, 10) >= 700;
          const large = size >= 24 || (bold && size >= 18.66);
          const need = large ? 3 : 4.5;
          const got = ratio(parse(st.color), bgOf(el));
          out.push({ text: t.textContent.trim().slice(0, 28), cls: el.className || el.tagName, got: Math.round(got * 100) / 100, need });
        }
        return out;
      }, name === 'drawer');
      measured += res.length;
      const bad = res.filter(x => x.got < x.need);
      ok(scheme + '/' + name, bad.length === 0,
        bad.slice(0, 4).map(x => '"' + x.text + '" (' + x.cls + ') ' + x.got + ':1, needs ' + x.need).join(' | '));
    }
    await page.close();
  }
} finally { await browser.close(); }

console.log('\n=== RENDERED CONTRAST (real Chromium, light + dark) ===');
console.log('text elements measured : ' + measured);
console.log('assertions passed      : ' + pass);
console.log('assertions failed      : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

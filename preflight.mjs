/* preflight.mjs — rebuilt in the Fable 5 handoff session (the original was
   lost with the old session). Checks the documented mobile invariants against
   the shipped file in real Chromium:
   - viewport meta present
   - the iOS zoom guard: every text-entry control (input/textarea/select)
     computes to >= 16px font, in every mode that shows one — this is the
     documented "16px minimum" rule (iOS auto-zooms only text entry, and the
     shipped app has always had sub-16px *buttons*, so the rule is scoped to
     text entry)
   - no horizontal overflow at 390px and 320px widths
   - visible tap targets >= 24px (WCAG 2.2 target-size floor; shipped minimum
     measures 39px today)
   - no console or page errors while driving through the main modes */
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const chromium = (await import('@sparticuz/chromium')).default;

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };

const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...(chromium.args || []), '--no-sandbox', '--disable-dev-shm-usage'], headless: 'shell' });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e.message)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

const url = 'file://' + fs.realpathSync('./polyglot.html');

async function textEntryFonts() {
  return page.evaluate(() => [...document.querySelectorAll('input, textarea, select')]
    .filter(el => !(el.tagName === 'INPUT' && ['range', 'checkbox', 'radio', 'button', 'submit', 'color', 'file'].includes(el.type)))
    .map(el => ({ id: el.id || el.tagName, size: parseFloat(getComputedStyle(el).fontSize) })));
}
async function overflow() {
  return page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth }));
}
async function tapTargets() {
  // anything that answers a tap counts, not just real buttons: the task bars were a plain div with a
  // click handler, too small for a thumb, and this check could not see them
  return page.evaluate(() => [...document.querySelectorAll('button, a, select, input, *')]
    .filter(el => el.matches('button, a, select, input') || typeof el.onclick === 'function')
    .filter((el, i, all) => !(typeof el.onclick === 'function' && el.querySelector('button, a, select, input')))
    .filter(el => el.offsetParent !== null)
    .map(el => ({ id: el.id || el.tagName, h: el.getBoundingClientRect().height, w: el.getBoundingClientRect().width }))
    .filter(t => t.h > 0));
}

for (const width of [390, 320]) {
  await page.setViewport({ width, height: 844, isMobile: true, hasTouch: true });
  await page.goto(url, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 300));

  const o = await overflow();
  ok('layout/no-horizontal-overflow@' + width, o.scrollW <= o.innerW, o.scrollW + 'px content in ' + o.innerW + 'px viewport');

  /* the app name, the phase rail and the score each stay on a single line */
  const wrap = await page.evaluate(() => {
    // count the rendered lines of the text itself; element height lies for 44px buttons
    const oneLine = el => { if (!el) return true; const r = document.createRange(); r.selectNodeContents(el);
      // mixed sizes on one line (a bold 15px number next to 14px text) start a pixel or two apart,
      // so a new line only counts when the gap is more than half the font size
      const tops = [...r.getClientRects()].filter(x => x.width > 0).map(x => x.top).sort((a, b) => a - b);
      const half = parseFloat(getComputedStyle(el).fontSize) / 2;
      let lines = tops.length ? 1 : 0;
      for (let i = 1; i < tops.length; i++) if (tops[i] - tops[i - 1] > half) lines++;
      return lines <= 1; };
    const rail = document.querySelector('.rail');
    return { name: oneLine(document.querySelector('.mark b')), score: oneLine(document.querySelector('.score span')),
             phases: [...document.querySelectorAll('.rail .phase')].every(oneLine),
             railFits: rail.scrollWidth <= rail.clientWidth + 1 };
  });
  ok('layout/header-single-line@' + width, wrap.name && wrap.score && wrap.phases && wrap.railFits, JSON.stringify(wrap));

  if (width === 390) {
    /* the embedded faces must really load — a silent fallback to system-ui still "looks fine" */
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      const sans = await document.fonts.load('16px "Atkinson Next"');
      const mono = await document.fonts.load('16px "Atkinson Mono"');
      return { sans: sans.length, mono: mono.length,
        body: getComputedStyle(document.body).fontFamily.split(',')[0].replace(/"/g, '') };
    });
    ok('fonts/sans-loads', fonts.sans > 0, JSON.stringify(fonts));
    ok('fonts/mono-loads', fonts.mono > 0, JSON.stringify(fonts));
    ok('fonts/body-uses-it', fonts.body === 'Atkinson Next', fonts.body);
    ok('meta/viewport', await page.evaluate(() =>
      !!document.querySelector('meta[name=viewport]') &&
      /width=device-width/.test(document.querySelector('meta[name=viewport]').content)), 'viewport meta missing or wrong');

    /* zoom guard across the modes that show a text-entry control */
    const modes = [
      ['learn', () => { window.loadLesson(0); window.setPhase('learn'); }],
      ['build', () => { window.loadLesson(0); window.setPhase('build'); window.loadTask(0); }],
      ['markup', () => { window.setMarkupLesson(0); window.setPhase('build'); }]
    ];
    for (const [mode, enter] of modes) {
      await page.evaluate(enter);
      await new Promise(r => setTimeout(r, 150));
      const fonts = await textEntryFonts();
      const small = fonts.filter(f => f.size < 16);
      ok('zoomguard/' + mode, small.length === 0, small.map(s => s.id + '=' + s.size + 'px').join(', '));
    }

    /* tap targets on every screen, not just build */
    const screens = [
      ['learn', () => { window.loadLesson(0); window.setPhase('learn'); }],
      ['predict', () => { window.loadLesson(0); window.setPhase('predict'); }],
      ['build', () => { window.loadLesson(0); window.setPhase('build'); window.loadTask(0); }],
      ['markup', () => { window.setMarkupLesson(0); window.setPhase('build'); }],
      ['drawer', () => { window.loadLesson(0); window.setPhase('learn'); document.getElementById('btnLessons').click(); }]
    ];
    let targets = [];
    for (const [name, enter] of screens) {
      await page.evaluate(enter);
      await new Promise(r => setTimeout(r, 200));
      const here = await tapTargets();
      const small = here.filter(t => Math.min(t.h, t.w) < 44);
      ok('tap/44px-floor/' + name, small.length === 0, small.slice(0, 6).map(t => t.id + '=' + Math.round(t.w) + 'x' + Math.round(t.h)).join(', '));
      targets = targets.concat(here);
      await page.evaluate(() => { const d = document.getElementById('drawer'); if (d) d.dataset.open = 'false'; });
    }

    const minH = Math.min(...targets.map(t => t.h));
    console.log('tap targets measured  : ' + targets.length + ' visible, smallest ' + Math.round(minH) + 'px');
  }
}

ok('console/no-errors', errors.length === 0, errors.slice(0, 3).join(' | '));
await browser.close();

console.log('\n=== PRE-FLIGHT (real Chromium, phone widths) ===');
console.log('assertions passed     : ' + pass);
console.log('assertions failed     : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

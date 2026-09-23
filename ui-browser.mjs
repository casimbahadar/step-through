import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const chromium = (await import('@sparticuz/chromium')).default;

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };

const browser = await puppeteer.launch({
  executablePath: await chromium.executablePath(),
  args: [...(chromium.args || []), '--no-sandbox', '--disable-dev-shm-usage'],
  headless: 'shell'
});
const page = await browser.newPage();
await page.setViewport({ width: 420, height: 900 });
const errors = [];
page.on('pageerror', e => errors.push(String(e.message)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('file://' + fs.realpathSync('./polyglot.html'), { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 300));

ok('boot/no-console-errors', errors.length === 0, errors.slice(0, 2).join(' | '));
ok('boot/renders', await page.evaluate(() => !!document.getElementById('lessonTitle').textContent), 'no lesson title');

/* the programming track still works in a real browser, not just jsdom */
await page.evaluate(() => { window.loadLesson(0); window.setPhase('build'); window.loadTask(0); });
await page.evaluate(() => {
  const e = document.getElementById('editor');
  e.value = 'print("Good morning!")';
  e.dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById('btnCheck').click();
});
ok('code/solves-in-real-browser', await page.evaluate(() => document.getElementById('panelOut').textContent.includes('Correct.')),
  await page.evaluate(() => document.getElementById('panelOut').textContent.slice(0, 80)));

/* markup track */
await page.evaluate(() => window.setMarkupLesson(0));
ok('markup/opens', await page.evaluate(() => document.getElementById('lessonTitle').textContent.includes('page is made of')),
  await page.evaluate(() => document.getElementById('lessonTitle').textContent));
await page.evaluate(() => window.setPhase('build'));
ok('markup/controls-swap', await page.evaluate(() =>
  document.getElementById('markupControls').style.display === 'flex' &&
  document.getElementById('buildControls').style.display === 'none' &&
  document.getElementById('stepbar').style.display === 'none'), 'wrong controls shown');
ok('markup/language-picker-hidden', await page.evaluate(() => document.getElementById('langSel').style.display === 'none'), 'picker still visible');

/* the scaffold must not already pass */
await page.evaluate(() => document.getElementById('mCheck').click());
await new Promise(r => setTimeout(r, 250));
ok('markup/scaffold-fails', await page.evaluate(() => document.querySelectorAll('#mChecks .checkrow.fail').length > 0),
  'the starting point already passed');

/* solve it the way a person would: type the answer into the HTML pane.
   (Injecting S.mHtml directly is not equivalent — the app re-renders the
   preview from its own editor buffers, so an injected value is discarded on
   the next keystroke.) */
await page.evaluate(() => {
  const t = window.MARKUP_LESSONS[0].tasks[0];
  document.getElementById('paneHtml').click();
  const e = document.getElementById('mEditor');
  e.value = t.solution.html;
  e.dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById('paneCss').click();
  const c = document.getElementById('mEditor');
  c.value = t.solution.css;
  c.dispatchEvent(new Event('input', { bubbles: true }));
});
await new Promise(r => setTimeout(r, 350));
await page.evaluate(() => document.getElementById('mCheck').click());
await new Promise(r => setTimeout(r, 350));
ok('markup/solution-passes', await page.evaluate(() => document.getElementById('mChecks').textContent.includes('Correct.')),
  await page.evaluate(() => document.getElementById('mChecks').textContent.slice(0, 120)));
ok('markup/awards-stars', await page.evaluate(() => window.S.progress['html-1'] && window.S.progress['html-1'].done), 'no progress recorded');
ok('markup/preview-rendered', await page.evaluate(() => {
  const f = document.getElementById('mPreview');
  const h1 = f.contentDocument.querySelector('h1');
  return !!h1 && h1.textContent === 'Toronto' && h1.getBoundingClientRect().width > 0;
}), 'the preview did not render a laid-out heading');

/* typing in the CSS pane must update the preview */
await page.evaluate(() => {
  document.getElementById('paneCss').click();
  const e = document.getElementById('mEditor');
  e.value = 'h1 { color: rgb(9, 9, 9); }';
  e.dispatchEvent(new Event('input', { bubbles: true }));
});
await new Promise(r => setTimeout(r, 350));
ok('markup/css-pane-live', await page.evaluate(() => {
  const f = document.getElementById('mPreview');
  const h1 = f.contentDocument.querySelector('h1');
  return h1 && f.contentWindow.getComputedStyle(h1).color === 'rgb(9, 9, 9)';
}), 'the CSS pane did not affect the preview');

/* ---------- moving on after a correct answer (reported from the live site) ---------- */
{
  const solve = async (code) => page.evaluate(c => {
    const e = document.getElementById('editor'); e.value = c;
    e.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('btnCheck').click();
  }, code);
  const next = () => page.evaluate(() => { const b = document.getElementById('btnNext');
    return { shown: !b.hidden, label: b.textContent, runIsPrimary: document.getElementById('btnRun').className === 'primary' }; });
  await page.evaluate(() => { for (const k of Object.keys(window.S.progress)) delete window.S.progress[k];
    window.loadLesson(0); window.setPhase('build'); window.loadTask(0); });
  let n = await next();
  ok('next/hidden-before-solving', !n.shown && n.runIsPrimary, JSON.stringify(n));
  await solve('print("Good morning!")');
  n = await next();
  ok('next/appears-after-solving', n.shown && n.label === 'Next task' && !n.runIsPrimary, JSON.stringify(n));
  await page.evaluate(() => document.getElementById('btnNext').click());
  ok('next/opens-task-2', await page.evaluate(() => window.S.taskIndex === 1 && document.getElementById('btnNext').hidden), 'did not move to task 2');
  await solve('print("Coffee")\nprint("Bagel")');
  await page.evaluate(() => document.getElementById('btnNext').click());
  await solve('print("Latte")');
  n = await next();
  ok('next/last-task-offers-next-lesson', n.shown && n.label === 'Next lesson', JSON.stringify(n));
  await page.evaluate(() => document.getElementById('btnNext').click());
  ok('next/opens-lesson-2-at-learn', await page.evaluate(() => window.S.lessonIndex === 1 && window.S.phase === 'learn'),
    await page.evaluate(() => window.S.lessonIndex + '/' + window.S.phase));

  /* skipping ahead with the task bars, then finishing: Next goes back to the task still open */
  await page.evaluate(() => { window.setPhase('build'); document.querySelector('#taskDots button[data-t="2"]').click(); });
  ok('bars/jump-to-task-3', await page.evaluate(() => window.S.taskIndex === 2), 'task bar did not open task 3');
  await solve(await page.evaluate(() => window.LESSONS[1].tasks[2].solution));
  n = await next();
  ok('next/points-at-skipped-task', n.shown && n.label === 'Finish task 1', JSON.stringify(n));
  const bars = await page.evaluate(() => [...document.querySelectorAll('#taskDots button')].map(b => ({
    label: b.getAttribute('aria-label'), w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height })));
  ok('bars/labelled-buttons', bars.length === 3 && bars[0].label === 'Task 1 of 3' && /done/.test(bars[2].label), JSON.stringify(bars));
  ok('bars/thumb-sized', bars.every(b => b.w >= 44 && b.h >= 44), JSON.stringify(bars));
}

/* ---------- the HTML and CSS track gets the same Next ---------- */
{
  await page.evaluate(() => { delete window.S.progress['html-1']; window.setMarkupLesson(0); window.setPhase('build'); });
  ok('mnext/hidden-before-solving', await page.evaluate(() => document.getElementById('mNext').hidden), 'shown too early');
  await page.evaluate(() => {
    const t = window.MARKUP_LESSONS[0].tasks[0];
    document.getElementById('paneHtml').click();
    const e = document.getElementById('mEditor'); e.value = t.solution.html; e.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('paneCss').click();
    const c = document.getElementById('mEditor'); c.value = t.solution.css; c.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => document.getElementById('mCheck').click());
  await new Promise(r => setTimeout(r, 400));
  const m = await page.evaluate(() => ({ shown: !document.getElementById('mNext').hidden, label: document.getElementById('mNext').textContent }));
  ok('mnext/appears-after-solving', m.shown && m.label === 'Next task', JSON.stringify(m));
  await page.evaluate(() => document.getElementById('mNext').click());
  ok('mnext/opens-task-2', await page.evaluate(() => window.S.mTask === 1), 'did not move to task 2');
}

ok('boot/still-no-errors', errors.length === 0, errors.slice(0, 2).join(' | '));
await browser.close();

console.log('\n=== BROWSER UI TEST (real Chromium, shipped file) ===');
console.log('assertions passed : ' + pass);
console.log('assertions failed : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

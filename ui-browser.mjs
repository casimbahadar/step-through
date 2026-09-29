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
  const next = () => page.evaluate(() => { const b = document.getElementById('btnNextTask');
    return { shown: !b.hidden, label: b.textContent, runIsPrimary: document.getElementById('btnRun').className === 'primary' }; });
  await page.evaluate(() => { for (const k of Object.keys(window.S.progress)) delete window.S.progress[k];
    window.loadLesson(0); window.setPhase('build'); window.loadTask(0); });
  let n = await next();
  ok('next/hidden-before-solving', !n.shown && n.runIsPrimary, JSON.stringify(n));
  await solve('print("Good morning!")');
  n = await next();
  ok('next/appears-after-solving', n.shown && n.label === 'Next task' && !n.runIsPrimary, JSON.stringify(n));
  await page.evaluate(() => document.getElementById('btnNextTask').click());
  ok('next/opens-task-2', await page.evaluate(() => window.S.taskIndex === 1 && document.getElementById('btnNextTask').hidden), 'did not move to task 2');
  await solve('print("Coffee")\nprint("Bagel")');
  await page.evaluate(() => document.getElementById('btnNextTask').click());
  await solve('print("Latte")');
  n = await next();
  ok('next/last-task-offers-next-lesson', n.shown && n.label === 'Next lesson', JSON.stringify(n));
  await page.evaluate(() => document.getElementById('btnNextTask').click());
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

/* ---------- the stepper's own controls (a duplicate id once silently disabled "next step") ---------- */
{
  await page.evaluate(() => { window.loadLesson(0); window.setPhase('build'); window.loadTask(0);
    const e = document.getElementById('editor'); e.value = 'print(1)\nprint(2)\nprint(3)';
    e.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('btnRun').click(); });
  const st = () => page.evaluate(() => window.S.step);
  const click = id => page.evaluate(i => document.getElementById(i).click(), id);
  const s0 = await st(); await click('btnNext'); const s1 = await st();
  ok('stepper/next-step-moves-forward', s1 === s0 + 1, s0 + ' -> ' + s1);
  await click('btnPrev'); ok('stepper/previous-step-moves-back', (await st()) === s0, String(await st()));
  ok('stepper/does-not-change-task', await page.evaluate(() => window.S.taskIndex === 0), 'stepping moved the task');
}
/* ---------- no two elements may share an id: getElementById silently returns only the first ---------- */
{
  const dupes = await page.evaluate(() => { const seen = {}; document.querySelectorAll('[id]').forEach(e => seen[e.id] = (seen[e.id] || 0) + 1);
    return Object.entries(seen).filter(([, n]) => n > 1).map(([k, n]) => k + ' x' + n); });
  ok('dom/ids-unique', dupes.length === 0, dupes.join(', '));
}

/* ---------- resuming after the phone unloads the tab (ux-flow-design: interruptions) ---------- */
{
  await page.evaluate(() => { for (const L of window.LESSONS.slice(0, 5)) for (const t of L.tasks) window.S.progress[t.id] = { stars: 3, done: true };
    window.loadLesson(4); window.setPhase('build'); window.loadTask(1);
    const s = document.getElementById('langSel'); s.value = 'ruby'; s.dispatchEvent(new Event('change', { bubbles: true }));
    const e = document.getElementById('editor'); e.value = '# half-written'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await new Promise(r => setTimeout(r, 700));
  await page.reload({ waitUntil: 'load' }); await new Promise(r => setTimeout(r, 700));
  const back = await page.evaluate(() => ({ lesson: window.S.lessonIndex, task: window.S.taskIndex, phase: window.S.phase, lang: window.S.lang, code: window.S.code }));
  ok('resume/place-and-language', back.lesson === 4 && back.task === 1 && back.phase === 'build' && back.lang === 'ruby', JSON.stringify(back));
  ok('resume/typed-code-kept', back.code === '# half-written', JSON.stringify(back.code));
  await page.evaluate(() => document.getElementById('btnResetTask').click());
  await new Promise(r => setTimeout(r, 700));
  await page.reload({ waitUntil: 'load' }); await new Promise(r => setTimeout(r, 700));
  ok('resume/reset-clears-the-draft', await page.evaluate(() => window.S.code !== '# half-written' && window.S.taskIndex === 1), 'draft survived Reset');
  await page.evaluate(() => { const s = document.getElementById('langSel'); s.value = 'python'; s.dispatchEvent(new Event('change', { bubbles: true }));
    window.loadLesson(0); });
}

/* ---------- tap budgets for the core tasks (ux-flow-design: measure the flow, not just the screens) ----------
   Driven only by real taps on visible controls. If a flow grows, this fails until the change is a decision. */
{
  const tap = async id => page.evaluate(i => { const el = document.getElementById(i);
    if (!el || el.hidden || el.disabled || !el.getClientRects().length) return 'missing:' + i;
    el.click(); return 'ok'; }, id);
  const flow = async (name, budget, steps, done) => {
    let taps = 0, broke = null;
    for (const st of steps) { if (typeof st === 'string') { const r = await tap(st); taps++; if (r !== 'ok') { broke = r; break; } } else await page.evaluate(st); await new Promise(r => setTimeout(r, 150)); }
    const reached = !broke && await page.evaluate(done);
    ok('taps/' + name + ' (' + taps + ' of ' + budget + ')', reached && taps <= budget, broke || (reached ? taps + ' taps' : 'goal not reached'));
  };
  await page.evaluate(() => { for (const k of Object.keys(window.S.progress)) delete window.S.progress[k]; window.S.drafts = {}; window.loadLesson(0); window.setPhase('learn'); });
  await flow('first-answer-checked', 3, ['phBuild', 'buildCode',
      () => { const e = document.getElementById('editor'); e.value = 'print("Good morning!")'; e.dispatchEvent(new Event('input', { bubbles: true })); },
      'btnCheck'], () => !!(window.S.progress['speak-1'] || {}).done);
  await flow('move-on-after-solving', 1, ['btnNextTask'], () => window.S.taskIndex === 1);
  await flow('change-appearance', 2, ['btnLessons', 'themeDark'], () => document.documentElement.dataset.theme === 'dark');
  await page.evaluate(() => { document.getElementById('themeSystem').click(); document.getElementById('drawer').dataset.open = 'false'; });
}

ok('boot/still-no-errors', errors.length === 0, errors.slice(0, 2).join(' | '));
await browser.close();

console.log('\n=== BROWSER UI TEST (real Chromium, shipped file) ===');
console.log('assertions passed : ' + pass);
console.log('assertions failed : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

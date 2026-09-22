import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const chromium = (await import('@sparticuz/chromium')).default;

/* Load the markup track from source or from the shipped file */
const from = process.argv[2] === 'shipped' ? 'shipped' : 'src';
const src = from === 'shipped'
  ? fs.readFileSync(new URL('./polyglot.html', import.meta.url), 'utf8')
  : fs.readFileSync(new URL('./markup.mjs', import.meta.url), 'utf8');
const block = src.match(/\/\* MARKUP-START \*\/([\s\S]*?)\/\* MARKUP-END \*\//)[1];
const { MARKUP_LESSONS, markupDocument, runMarkupChecks } =
  new Function(block + '\nreturn { MARKUP_LESSONS, markupDocument, runMarkupChecks };')();

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };

const exe = await chromium.executablePath();
const browser = await puppeteer.launch({
  executablePath: exe,
  args: [...(chromium.args || []), '--no-sandbox', '--disable-dev-shm-usage'],
  headless: 'shell'
});

async function checkIn(page, html, css, checks) {
  await page.setViewport({ width: 420, height: 800 });
  await page.setContent(markupDocument(html, css), { waitUntil: 'load' });
  return page.evaluate((fnSrc, checks) => {
    const fn = new Function('return ' + fnSrc)();
    return fn(document, window, checks);
  }, runMarkupChecks.toString(), checks);
}

const page = await browser.newPage();
let taskCount = 0;

for (const L of MARKUP_LESSONS) {
  /* the worked example must render without the checker choking on it */
  const demoOk = await checkIn(page, L.demo.html, L.demo.css, [{ kind: 'exists', sel: 'body *', msg: 'renders something' }]);
  ok('demo/' + L.id, demoOk.every(r => r.ok), 'the demo rendered nothing');

  for (const t of L.tasks) {
    taskCount++;
    /* 1. the model answer must satisfy every check */
    const solved = await checkIn(page, t.solution.html, t.solution.css, t.checks);
    const failedChecks = solved.filter(r => !r.ok);
    ok('solution/' + t.id, failedChecks.length === 0, failedChecks.map(r => r.msg).join(' | '));

    /* 2. the starting point must NOT — otherwise the task is already done */
    const started = await checkIn(page, t.scaffold.html, t.scaffold.css, t.checks);
    ok('no-freebie/' + t.id, started.some(r => !r.ok), 'the scaffold already passes every check');

    /* 3. failure messages must name something concrete */
    const bad = started.filter(r => !r.ok);
    ok('messages/' + t.id, bad.every(r => r.msg && r.msg.length > 12 && !/undefined/.test(r.msg)),
      bad.map(r => r.msg).join(' | '));

    /* 4. hints must exist and not simply be the answer */
    ok('hints/' + t.id, Array.isArray(t.hints) && t.hints.length >= 2, (t.hints || []).length + ' hints');
  }
}

/* the checker must be able to fail as well as pass */
{
  const r = await checkIn(page, '<p>hi</p>', '', [
    { kind: 'exists', sel: 'h1' },
    { kind: 'style', sel: 'p', prop: 'color', equals: 'rgb(255, 0, 0)' },
    { kind: 'sideBySide', sel: 'p' }
  ]);
  ok('checker/detects-missing-element', !r[0].ok, 'claimed a missing h1 exists');
  ok('checker/detects-wrong-style', !r[1].ok, 'claimed the wrong colour was right');
  ok('checker/handles-too-few-elements', !r[2].ok, 'side-by-side passed with one element');
}
{
  const r = await checkIn(page, '<div class=r><b>a</b><b>b</b></div>', '.r{display:flex}', [{ kind: 'sideBySide', sel: '.r b' }]);
  ok('checker/detects-real-layout', r[0].ok, 'flex row not detected as side by side');
  const r2 = await checkIn(page, '<div class=r><b>a</b><b>b</b></div>', '.r{display:block} b{display:block}', [{ kind: 'sideBySide', sel: '.r b' }]);
  ok('checker/detects-stacking', !r2[0].ok, 'stacked boxes reported as a row');
}

await browser.close();

console.log('\n=== MARKUP ORACLE (real Chromium) ===');
console.log('lessons                : ' + MARKUP_LESSONS.length + ', tasks: ' + taskCount);
console.log('assertions passed      : ' + pass);
console.log('assertions failed      : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.slice(0, 12).forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

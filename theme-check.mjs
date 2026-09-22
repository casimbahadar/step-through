/* theme-check.mjs — the Appearance control, in real Chromium.
   Proves: the default follows the phone; Light and Dark override the phone in
   both directions; the choice survives a reload; the browser bar colour follows;
   and the two copies of the dark token list (phone setting vs chosen) are identical. */
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const chromium = (await import('@sparticuz/chromium')).default;

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };

const URL = 'file://' + fs.realpathSync('./polyglot.html');
const LIGHT_BG = 'rgb(242, 244, 247)', DARK_BG = 'rgb(21, 26, 35)';
const TOKENS = ['--paper', '--sheet', '--rule', '--rule-2', '--ink', '--ink-soft', '--slate', '--slate-2', '--mark', '--flash',
  '--good', '--good-bg', '--bad', '--bad-bg', '--gold', '--focus', '--btn-bg', '--btn-fg', '--console', '--console-fg',
  '--scrim', '--tok-kw', '--tok-bi', '--tok-str', '--tok-num'];

const browser = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...(chromium.args || []), '--no-sandbox', '--disable-dev-shm-usage'], headless: 'shell' });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e.message)));
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  const scheme = v => page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: v }]);
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const state = () => page.evaluate(() => ({
    attr: document.documentElement.dataset.theme || null,
    pressed: [...document.querySelectorAll('.themepick button')].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.themeChoice),
    metas: [...document.querySelectorAll('meta[name="theme-color"]')].map(m => m.getAttribute('content'))
  }));
  const pick = async choice => { await page.evaluate(c => document.querySelector('[data-theme-choice="' + c + '"]').click(), choice);
    await new Promise(r => setTimeout(r, 150)); };

  /* a clean start follows the phone */
  await scheme('light');
  await page.goto(URL, { waitUntil: 'load' });
  await page.evaluate(() => { try { localStorage.removeItem('polyglot:theme'); } catch (e) {} });
  await page.reload({ waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 300));
  let st = await state();
  ok('default/no-override', st.attr === null, JSON.stringify(st));
  ok('default/match-phone-pressed', st.pressed.join() === 'system', st.pressed.join());
  ok('default/light-phone-light-page', (await bg()) === LIGHT_BG, await bg());
  await scheme('dark');
  await new Promise(r => setTimeout(r, 150));
  ok('default/dark-phone-dark-page', (await bg()) === DARK_BG, await bg());

  /* Light chosen on a dark phone must win */
  await pick('light');
  st = await state();
  ok('light-over-dark/page', (await bg()) === LIGHT_BG, await bg());
  ok('light-over-dark/pressed', st.pressed.join() === 'light', st.pressed.join());
  ok('light-over-dark/browser-bar', st.metas.every(m => m === '#F2F4F7'), st.metas.join());

  /* Dark chosen on a light phone must win */
  await scheme('light');
  await pick('dark');
  st = await state();
  ok('dark-over-light/page', (await bg()) === DARK_BG, await bg());
  ok('dark-over-light/browser-bar', st.metas.every(m => m === '#151A23'), st.metas.join());

  /* the choice survives a reload, and is in place before anything draws */
  await page.reload({ waitUntil: 'domcontentloaded' });
  const early = await page.evaluate(() => document.documentElement.dataset.theme || null);
  ok('persist/applied-before-paint', early === 'dark', String(early));
  await new Promise(r => setTimeout(r, 300));
  ok('persist/still-dark-after-load', (await bg()) === DARK_BG, await bg());
  ok('persist/dark-pressed', (await state()).pressed.join() === 'dark', (await state()).pressed.join());

  /* the two dark token lists must be identical: chosen-dark on a light phone vs phone-dark */
  const read = () => page.evaluate(ts => ts.map(t => getComputedStyle(document.documentElement).getPropertyValue(t).trim()), TOKENS);
  const chosen = await read();
  await pick('system');
  await scheme('dark');
  await new Promise(r => setTimeout(r, 150));
  const phone = await read();
  const drift = TOKENS.filter((t, i) => chosen[i] !== phone[i]);
  ok('tokens/dark-lists-identical', drift.length === 0, drift.map(t => t + ' ' + chosen[TOKENS.indexOf(t)] + ' vs ' + phone[TOKENS.indexOf(t)]).join(', '));
  ok('tokens/all-defined', phone.every(v => v !== ''), TOKENS.filter((t, i) => !phone[i]).join(','));

  /* back to Match phone: follows the phone both ways again */
  ok('system-again/dark-phone', (await bg()) === DARK_BG, await bg());
  await scheme('light');
  await new Promise(r => setTimeout(r, 150));
  ok('system-again/light-phone', (await bg()) === LIGHT_BG, await bg());
  st = await state();
  ok('system-again/metas-restored', st.metas.join() === '#F2F4F7,#151A23', st.metas.join());

  ok('console/no-errors', errors.length === 0, errors.slice(0, 2).join(' | '));
} finally { await browser.close(); }

console.log('\n=== THEME TOGGLE (real Chromium) ===');
console.log('assertions passed     : ' + pass);
console.log('assertions failed     : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

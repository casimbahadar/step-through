import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { loadParts } from './loadparts.mjs';

const from = process.argv[2] === 'shipped' ? 'shipped' : 'src';
const ONLY = process.argv[3] ? process.argv[3].split(',') : null;
const wanted = lang => !ONLY || ONLY.includes(lang);
const { POLYGLOT, LESSONS } = loadParts(from);
const { translate, execute } = POLYGLOT;

const DIR = '/tmp/oracle';
fs.rmSync(DIR, { recursive: true, force: true });
fs.mkdirSync(DIR, { recursive: true });
const ENV = { ...process.env, GOCACHE: '/tmp/gocache', HOME: '/tmp', GOFLAGS: '-mod=mod' };

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };

/* Languages disagree only on how they render a whole number that came from
   division: 25 versus 25.0. Compare values, not spelling. */
const normalise = lines => lines.map(l => l
  .replace(/(-?\d+)\.0(?=\b|$)/g, '$1')
  .replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false'));
const clean = s => s.replace(/\n$/, '').split('\n').filter((l, i, a) => !(i === a.length - 1 && l === ''));

const programs = [];
for (const L of LESSONS) {
  programs.push({ id: L.id + '/demo', src: L.demo.code, skip: L.unavailable || [], inputs: L.demo.inputs || [] });
  for (const t of L.tasks) if (t.solution) programs.push({ id: t.id, src: t.solution, skip: L.unavailable || [], inputs: t.inputs || [] });
}

const RUNNERS = {
  ruby: { file: 'p.rb', run: (stdin) => execFileSync('ruby', [DIR + '/p.rb'], { encoding: 'utf8', timeout: 20000, env: ENV, input: stdin }) },
  php: { file: 'p.php', run: (stdin) => execFileSync('php', [DIR + '/p.php'], { encoding: 'utf8', timeout: 20000, env: ENV, input: stdin }) },
  go: {
    file: 'p.go',
    run: (stdin) => execFileSync('go', ['run', 'p.go'], { encoding: 'utf8', timeout: 90000, cwd: DIR, env: ENV, input: stdin })
  },
  java: {
    file: 'Main.java',
    run: (stdin) => {
      execFileSync('javac', ['Main.java'], { encoding: 'utf8', timeout: 90000, cwd: DIR, env: ENV });
      return execFileSync('java', ['Main'], { encoding: 'utf8', timeout: 30000, cwd: DIR, env: ENV, input: stdin });
    }
  },
  csharp: {
    file: 'p.cs',
    run: (stdin) => {
      execFileSync('mcs', ['-out:p.exe', 'p.cs'], { encoding: 'utf8', timeout: 60000, cwd: DIR, env: ENV });
      return execFileSync('mono', ['p.exe'], { encoding: 'utf8', timeout: 30000, cwd: DIR, env: ENV, input: stdin });
    }
  }
};

const summary = {};
for (const lang of Object.keys(RUNNERS).filter(wanted)) {
  let exact = 0, formatting = 0, checked = 0;
  const t0 = Date.now();
  for (const p of programs) {
    if (p.skip.includes(lang)) continue;
    let src, mine, theirs;
    try { src = translate(p.src, 'python', lang); }
    catch (e) { ok(lang + '/translate/' + p.id, false, e.message); continue; }
    try { mine = execute(p.src, 'python', { inputs: p.inputs }).output; }
    catch (e) { ok(lang + '/engine/' + p.id, false, e.message); continue; }

    fs.writeFileSync(DIR + '/' + RUNNERS[lang].file, src);
    try { theirs = clean(RUNNERS[lang].run(p.inputs.length ? p.inputs.join('\n') + '\n' : undefined)); }
    catch (e) {
      const msg = String(e.stderr || e.stdout || e.message).split('\n').slice(0, 3).join(' | ');
      ok(lang + '/compiles/' + p.id, false, msg + '\n' + src);
      continue;
    }
    checked++;
    const isExact = JSON.stringify(mine) === JSON.stringify(theirs);
    const same = JSON.stringify(normalise(mine)) === JSON.stringify(normalise(theirs));
    if (isExact) exact++; else if (same) formatting++;
    ok(lang + '/agrees/' + p.id, same, 'ours ' + JSON.stringify(mine) + ' vs real ' + JSON.stringify(theirs) + '\n' + src);
  }
  summary[lang] = { checked, exact, formatting, secs: ((Date.now() - t0) / 1000).toFixed(0) };
}

/* Kotlin: one compile for all programs, each in its own package, then run each */
if (wanted('kotlin')) {
  const ktDir = DIR + '/kt';
  fs.mkdirSync(ktDir, { recursive: true });
  const names = [];
  programs.forEach((p, i) => {
    if (p.skip.includes('kotlin')) return;
    const name = 'p' + i;
    let src;
    try { src = translate(p.src, 'python', 'kotlin'); }
    catch (e) { ok('kotlin/translate/' + p.id, false, e.message); return; }
    fs.writeFileSync(ktDir + '/' + name + '.kt', 'package ' + name + '\n\n' + src);
    names.push({ name, p });
  });
  let compileErr = '';
  try {
    execFileSync('/opt/kotlinc/bin/kotlinc', [...names.map(n => n.name + '.kt'), '-d', 'out'],
      { encoding: 'utf8', timeout: 900000, cwd: ktDir, env: ENV, stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) {
    compileErr = String(e.stderr || e.stdout || '').split('\n').filter(l => /error:/.test(l)).slice(0, 4).join(' | ');
  }
  ok('kotlin/compiles', compileErr === '', compileErr);

  let exact = 0, formatting = 0, checked = 0;
  if (!compileErr) {
    for (const { name, p } of names) {
      const cls = name + '.' + name.charAt(0).toUpperCase() + name.slice(1) + 'Kt';
      let theirs;
      try {
        theirs = clean(execFileSync('java', ['-cp', 'out:/opt/kotlinc/lib/kotlin-stdlib.jar', cls],
          { encoding: 'utf8', timeout: 30000, cwd: ktDir, env: ENV,
            input: p.inputs.length ? p.inputs.join('\n') + '\n' : undefined }));
      } catch (e) { ok('kotlin/runs/' + p.id, false, String(e.stderr || e.message).split('\n')[0]); continue; }
      const mine = execute(p.src, 'python', { inputs: p.inputs }).output;
      checked++;
      const isExact = JSON.stringify(mine) === JSON.stringify(theirs);
      if (isExact) exact++; else if (JSON.stringify(normalise(mine)) === JSON.stringify(normalise(theirs))) formatting++;
      ok('kotlin/agrees/' + p.id, JSON.stringify(normalise(mine)) === JSON.stringify(normalise(theirs)),
        'ours ' + JSON.stringify(mine) + ' vs kotlin ' + JSON.stringify(theirs));
    }
  }
  summary.kotlin = { checked, exact, formatting, secs: '-' };
}

/* TypeScript: one type-check pass over every program, then run each */
if (wanted('typescript')) {
  const tsDir = DIR + '/ts';
  fs.mkdirSync(tsDir, { recursive: true });
  const names = [];
  programs.forEach((p, i) => {
    if (p.skip.includes('typescript')) return;
    const name = 'p' + i;
    // export {} makes each file its own module so top-level names cannot collide.
    // prompt() is a browser API; under node the harness plays the browser's part
    // with the same scripted answers the engine side receives.
    const shim = p.inputs.length
      ? 'const __answers: string[] = ' + JSON.stringify(p.inputs) + ';\nlet __next = 0;\nconst prompt = (): string => __answers[__next++];\n'
      : '';
    fs.writeFileSync(tsDir + '/' + name + '.ts', shim + translate(p.src, 'python', 'typescript') + '\nexport {};\n');
    names.push({ name, p });
  });
  let typeErrors = '';
  try {
    execFileSync('npx', ['tsc', '--strict', '--target', 'es2020', '--module', 'commonjs', ...names.map(n => n.name + '.ts')],
      { encoding: 'utf8', timeout: 240000, cwd: tsDir, env: ENV });
  } catch (e) { typeErrors = String(e.stdout || e.stderr || ''); }
  ok('typescript/typechecks', typeErrors.trim() === '', typeErrors.split('\n').slice(0, 4).join(' | '));

  let exact = 0, checked = 0;
  for (const { name, p } of names) {
    let theirs;
    try { theirs = clean(execFileSync('node', [name + '.js'], { encoding: 'utf8', timeout: 20000, cwd: tsDir, env: ENV, input: p.inputs.length ? p.inputs.join('\n') + '\n' : undefined })); }
    catch (e) { ok('typescript/runs/' + p.id, false, String(e.stderr || e.message).split('\n')[0]); continue; }
    const mine = execute(p.src, 'python', { inputs: p.inputs }).output;
    checked++;
    if (JSON.stringify(mine) === JSON.stringify(theirs)) exact++;
    ok('typescript/agrees/' + p.id, JSON.stringify(normalise(mine)) === JSON.stringify(normalise(theirs)),
      'ours ' + JSON.stringify(mine) + ' vs tsc ' + JSON.stringify(theirs));
  }
  summary.typescript = { checked, exact, formatting: checked - exact, secs: '-' };
}

console.log('\n=== REAL COMPILER ORACLE ===');
console.log('programs per language : ' + programs.length);
for (const [lang, r] of Object.entries(summary)) {
  console.log((lang + '                ').slice(0, 12) + ': ' + r.checked + ' ran, ' + r.exact + ' byte-identical, ' +
    r.formatting + ' differ only in x.0 formatting' + (r.secs !== '-' ? '  (' + r.secs + 's)' : ''));
}
console.log('assertions passed     : ' + pass);
console.log('assertions failed     : ' + fail);
if (failures.length) { console.log('\n--- failures (first 6) ---'); failures.slice(0, 6).forEach(f => console.log('* ' + f + '\n')); }
process.exit(fail === 0 ? 0 : 1);

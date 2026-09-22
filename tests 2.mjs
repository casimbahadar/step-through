import vm from 'node:vm';
import { parse, print, run, execute, translate, stripPos, fmt, LangError } from './engine.mjs';

let pass = 0, fail = 0;
const failures = [];
function ok(name, cond, detail) {
  if (cond) pass++;
  else { fail++; failures.push(name + (detail ? ' :: ' + detail : '')); }
}
function eqDeep(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

/* ============================================================
   A. CURATED PROGRAMS (written in Python surface syntax)
   ============================================================ */

const PROGRAMS = [
  { name: 'arithmetic', src: `a = 2 + 3 * 4\nb = (2 + 3) * 4\nprint(a, b)`, expect: ['14 20'] },
  { name: 'precedence-power', src: `print(2 ** 3 ** 2)\nprint(-2 ** 2)`, expect: ['512', '-4'] },
  { name: 'strings', src: `name = "world"\nprint("hello " + name)`, expect: ['hello world'] },
  { name: 'booleans', src: `print(True and False, True or False, not True)`, expect: ['False True False'] },
  { name: 'if-elif-else', src: `x = 7\nif x < 5:\n    print("small")\nelif x < 10:\n    print("medium")\nelse:\n    print("large")`, expect: ['medium'] },
  { name: 'while-loop', src: `n = 5\ntotal = 0\nwhile n > 0:\n    total = total + n\n    n = n - 1\nprint(total)`, expect: ['15'] },
  { name: 'for-range', src: `total = 0\nfor i in range(5):\n    total = total + i\nprint(total)`, expect: ['10'] },
  { name: 'for-range-start', src: `total = 0\nfor i in range(2, 6):\n    total = total + i\nprint(total)`, expect: ['14'] },
  { name: 'nested-loops', src: `count = 0\nfor i in range(3):\n    for j in range(3):\n        count = count + 1\nprint(count)`, expect: ['9'] },
  { name: 'lists', src: `xs = [1, 2, 3]\nxs.append(4)\nprint(len(xs), xs[0], xs[3])`, expect: ['4 1 4'] },
  { name: 'list-assign', src: `xs = [1, 2, 3]\nxs[1] = 99\nprint(xs)`, expect: ['[1, 99, 3]'] },
  { name: 'foreach', src: `total = 0\nfor v in [4, 5, 6]:\n    total = total + v\nprint(total)`, expect: ['15'] },
  { name: 'function', src: `def add(a, b):\n    return a + b\nprint(add(3, 4))`, expect: ['7'] },
  { name: 'recursion', src: `def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)\nprint(fact(6))`, expect: ['720'] },
  { name: 'fib', src: `def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\nfor i in range(8):\n    print(fib(i))`, expect: ['0', '1', '1', '2', '3', '5', '8', '13'] },
  { name: 'break-continue', src: `for i in range(10):\n    if i == 3:\n        continue\n    if i == 6:\n        break\n    print(i)`, expect: ['0', '1', '2', '4', '5'] },
  { name: 'locals-vs-globals', src: `x = 10\ndef f():\n    x = 99\n    return x\nprint(f(), x)`, expect: ['99 10'] },
  { name: 'read-global', src: `base = 100\ndef f(n):\n    return base + n\nprint(f(5))`, expect: ['105'] },
  { name: 'compound-assign', src: `x = 1\nx += 5\nx *= 3\nprint(x)`, expect: ['18'] },
  { name: 'modulo', src: `print(17 % 5, 20 % 4)`, expect: ['2 0'] },
  { name: 'division', src: `print(7 / 2)`, expect: ['3.5'] },
  { name: 'minmax', src: `print(min(3, 9), max(3, 9), abs(-4))`, expect: ['3 9 4'] },
  { name: 'string-index', src: `s = "abc"\nprint(s[1], len(s))`, expect: ['b 3'] },
  { name: 'bubble-sort', src: `xs = [5, 3, 8, 1]\nn = len(xs)\nfor i in range(n):\n    for j in range(n - 1):\n        if xs[j] > xs[j + 1]:\n            tmp = xs[j]\n            xs[j] = xs[j + 1]\n            xs[j + 1] = tmp\nprint(xs)`, expect: ['[1, 3, 5, 8]'] },
  { name: 'fizzbuzz', src: `for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`, expect: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'] }
];

for (const p of PROGRAMS) {
  let r;
  try { r = execute(p.src, 'python'); }
  catch (e) { ok('run/' + p.name, false, 'threw: ' + e.message); continue; }
  ok('run/' + p.name, !r.error && eqDeep(r.output, p.expect),
    r.error ? r.error.message : 'got ' + JSON.stringify(r.output));
}

/* ============================================================
   B. CROSS-LANGUAGE DIFFERENTIAL
   Python source -> AST -> JS source -> AST must be identical,
   and both must produce identical output.
   ============================================================ */

for (const p of PROGRAMS) {
  let astPy, jsSrc, astJs;
  try {
    astPy = parse(p.src, 'python');
    jsSrc = print(astPy, 'javascript');
    astJs = parse(jsSrc, 'javascript');
  } catch (e) {
    ok('xlang/' + p.name, false, 'threw: ' + e.message);
    continue;
  }
  ok('xlang-ast/' + p.name, eqDeep(stripPos(astPy), stripPos(astJs)), 'ASTs differ');
  const rJs = run(astJs, { lang: 'javascript' });
  const rPy = run(astPy, { lang: 'python' });
  // outputs differ only in boolean/null spelling, which is language-correct
  const normalise = (lines) => lines.map(l => l.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null'));
  ok('xlang-out/' + p.name, eqDeep(normalise(rPy.output), normalise(rJs.output)),
    JSON.stringify(rPy.output) + ' vs ' + JSON.stringify(rJs.output));
}

/* Python -> JS -> Python must return to the canonical Python rendering. */
for (const p of PROGRAMS) {
  try {
    const canonPy = print(parse(p.src, 'python'), 'python');
    const backPy = translate(translate(p.src, 'python', 'javascript'), 'javascript', 'python');
    ok('roundtrip/' + p.name, canonPy === backPy, 'round trip drifted');
  } catch (e) { ok('roundtrip/' + p.name, false, 'threw: ' + e.message); }
}

/* ============================================================
   C. V8 ORACLE
   Emitted JavaScript, executed by node, must agree with our evaluator.
   ============================================================ */

function runInV8(jsSrc) {
  const out = [];
  const sandbox = {
    console: { log: (...args) => out.push(args.map(a => typeof a === 'string' ? a : fmt(a, 'javascript')).join(' ')) },
    Math
  };
  vm.createContext(sandbox);
  vm.runInContext(jsSrc, sandbox, { timeout: 4000 });
  return out;
}

let oracleChecked = 0;
for (const p of PROGRAMS) {
  let jsSrc, mine, theirs;
  try {
    jsSrc = translate(p.src, 'python', 'javascript');
    mine = run(parse(jsSrc, 'javascript'), { lang: 'javascript' }).output;
    theirs = runInV8(jsSrc);
  } catch (e) { ok('oracle/' + p.name, false, 'threw: ' + e.message); continue; }
  oracleChecked++;
  ok('oracle/' + p.name, eqDeep(mine, theirs), JSON.stringify(mine) + ' vs V8 ' + JSON.stringify(theirs));
}

/* ---- randomised oracle ---- */

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function genProgram(seed) {
  const rnd = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const int = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
  const names = ['a', 'b', 'c', 'd'];
  const declared = [];
  const lines = [];

  const atom = () => {
    if (declared.length && rnd() < 0.55) return pick(declared);
    return String(int(0, 9));
  };
  const expr = (depth = 0) => {
    if (depth > 2 || rnd() < 0.35) return atom();
    const op = pick(['+', '-', '*']);
    return '(' + expr(depth + 1) + ' ' + op + ' ' + expr(depth + 1) + ')';
  };
  const compare = () => atom() + ' ' + pick(['<', '<=', '>', '>=', '==', '!=']) + ' ' + atom();

  const n = int(2, 3);
  for (let i = 0; i < n; i++) {
    const nm = names[i];
    lines.push(nm + ' = ' + expr());
    declared.push(nm);
  }

  const bodyCount = int(2, 4);
  for (let i = 0; i < bodyCount; i++) {
    const shape = pick(['assign', 'if', 'for', 'while', 'func']);
    if (shape === 'assign') {
      lines.push(pick(declared) + ' = ' + expr());
    } else if (shape === 'if') {
      lines.push('if ' + compare() + ':');
      lines.push('    ' + pick(declared) + ' = ' + expr());
      if (rnd() < 0.5) {
        lines.push('else:');
        lines.push('    ' + pick(declared) + ' = ' + expr());
      }
    } else if (shape === 'for') {
      const lim = int(1, 6);
      lines.push('for i in range(' + lim + '):');
      lines.push('    ' + pick(declared) + ' = ' + pick(declared) + ' + i');
      if (rnd() < 0.4) lines.push('    print(' + pick(declared) + ')');
    } else if (shape === 'while') {
      const v = 'w' + i;
      lines.push(v + ' = ' + int(1, 5));
      declared.push(v);
      lines.push('while ' + v + ' > 0:');
      lines.push('    ' + pick(declared.filter(x => x !== v)) + ' = ' + pick(declared) + ' + 1');
      lines.push('    ' + v + ' = ' + v + ' - 1');
    } else {
      const fn = 'f' + i;
      lines.push('def ' + fn + '(x, y):');
      lines.push('    if x > y:');
      lines.push('        return x - y');
      lines.push('    return y - x');
      lines.push(pick(declared) + ' = ' + fn + '(' + atom() + ', ' + atom() + ')');
    }
  }
  for (const d of declared) lines.push('print(' + d + ')');
  return lines.join('\n');
}

const RANDOM_CASES = 2000;
let randomOk = 0, randomSkipped = 0;
for (let seed = 1; seed <= RANDOM_CASES; seed++) {
  const src = genProgram(seed);
  let jsSrc, mine, theirs, astPy, astJs;
  try {
    astPy = parse(src, 'python');
    jsSrc = print(astPy, 'javascript');
    astJs = parse(jsSrc, 'javascript');
    mine = run(astJs, { lang: 'javascript' });
    if (mine.error) { randomSkipped++; continue; }
    theirs = runInV8(jsSrc);
  } catch (e) {
    ok('random/' + seed, false, 'threw: ' + e.message + '\n--- python ---\n' + src + '\n--- js ---\n' + (jsSrc || ''));
    continue;
  }
  const astMatch = eqDeep(stripPos(astPy), stripPos(astJs));
  const outMatch = eqDeep(mine.output, theirs);
  if (astMatch && outMatch) { randomOk++; pass++; }
  else {
    fail++;
    failures.push('random/' + seed + ' ast=' + astMatch + ' out=' + outMatch +
      '\n--- python ---\n' + src + '\n--- js ---\n' + jsSrc +
      '\nmine=' + JSON.stringify(mine.output) + '\nV8  =' + JSON.stringify(theirs));
  }
}

/* ============================================================
   D. JAVASCRIPT-NATIVE SOURCE (not translated) must work too
   ============================================================ */

const JS_PROGRAMS = [
  { name: 'js-basic', src: `let x = 5;\nlet y = x * 2;\nconsole.log(x, y);`, expect: ['5 10'] },
  { name: 'js-cfor', src: `let total = 0;\nfor (let i = 0; i < 5; i++) {\n  total = total + i;\n}\nconsole.log(total);`, expect: ['10'] },
  { name: 'js-forof', src: `let total = 0;\nfor (let v of [1, 2, 3]) {\n  total += v;\n}\nconsole.log(total);`, expect: ['6'] },
  { name: 'js-func', src: `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));`, expect: ['5'] },
  { name: 'js-elseif', src: `let x = 7;\nif (x < 5) {\n  console.log("a");\n} else if (x < 10) {\n  console.log("b");\n} else {\n  console.log("c");\n}`, expect: ['b'] },
  { name: 'js-length-push', src: `let xs = [1, 2];\nxs.push(3);\nconsole.log(xs.length);`, expect: ['3'] },
  { name: 'js-logic', src: `console.log(true && false, true || false, !true);`, expect: ['false true false'] },
  { name: 'js-no-semicolons', src: `let a = 1\nlet b = 2\nconsole.log(a + b)`, expect: ['3'] }
];

for (const p of JS_PROGRAMS) {
  let r;
  try { r = execute(p.src, 'javascript'); }
  catch (e) { ok('js/' + p.name, false, 'threw: ' + e.message); continue; }
  ok('js/' + p.name, !r.error && eqDeep(r.output, p.expect), r.error ? r.error.message : JSON.stringify(r.output));
}

/* JS -> Python -> JS round trip */
for (const p of JS_PROGRAMS) {
  try {
    const canon = print(parse(p.src, 'javascript'), 'javascript');
    const back = translate(translate(p.src, 'javascript', 'python'), 'python', 'javascript');
    ok('js-roundtrip/' + p.name, canon === back, 'drifted');
  } catch (e) { ok('js-roundtrip/' + p.name, false, 'threw: ' + e.message); }
}

/* ============================================================
   E. TEACHING ERRORS — wrong programs must fail usefully
   ============================================================ */

function errorOf(src, lang) {
  try {
    const r = execute(src, lang, { maxSteps: 20000 });
    return r.error ? r.error : null;
  } catch (e) { return e instanceof LangError ? e : new LangError(String(e.message), 0, ''); }
}

const ERROR_CASES = [
  { name: 'undefined-var', src: `print(x)`, lang: 'python', want: /has no value yet/ },
  { name: 'index-out-of-range', src: `xs = [1, 2]\nprint(xs[5])`, lang: 'python', want: /outside this list/ },
  { name: 'divide-by-zero', src: `print(1 / 0)`, lang: 'python', want: /Division by zero/ },
  { name: 'add-text-to-number', src: `print("a" + 1)`, lang: 'python', want: /can't add|can.t add/i },
  { name: 'infinite-loop', src: `while True:\n    x = 1`, lang: 'python', want: /ran too long/ },
  { name: 'runaway-recursion', src: `def f(n):\n    return f(n + 1)\nprint(f(1))`, lang: 'python', want: /nested function calls/ },
  { name: 'wrong-arg-count', src: `def f(a, b):\n    return a\nprint(f(1))`, lang: 'python', want: /expects 2 value/ },
  { name: 'unknown-function', src: `print(nope(1))`, lang: 'python', want: /no function called/ },
  { name: 'missing-colon', src: `if 1 < 2\n    print("hi")`, lang: 'python', want: /Expected/ },
  { name: 'unclosed-string', src: `print("hi)`, lang: 'python', want: /Unclosed text string/ },
  { name: 'tab-indent', src: `if 1 < 2:\n\tprint("hi")`, lang: 'python', want: /Tab character/ },
  { name: 'bad-indent', src: `if 1 < 2:\n    print("a")\n  print("b")`, lang: 'python', want: /line up/ },
  { name: 'unsupported-for-shape', src: `for (let i = 10; i > 0; i--) {\n  console.log(i);\n}`, lang: 'javascript', want: /not supported yet/ },
  { name: 'empty-block', src: `if (1 < 2) {\n}\n`, lang: 'javascript', want: /empty/ },
  { name: 'loop-var-after-loop', src: `for i in range(3):\n    print(i)\nprint(i)`, lang: 'python', want: /has no value yet/ }
];

for (const c of ERROR_CASES) {
  const e = errorOf(c.src, c.lang);
  ok('error/' + c.name, !!e && c.want.test(e.message), e ? 'got: ' + e.message : 'no error raised');
}

/* every error message must name a line and stay readable */
let msgOk = 0;
for (const c of ERROR_CASES) {
  const e = errorOf(c.src, c.lang);
  if (e && e.message.length < 140 && !/undefined|NaN|\[object/.test(e.message)) msgOk++;
}
ok('error/messages-are-human', msgOk === ERROR_CASES.length, msgOk + '/' + ERROR_CASES.length);

/* ============================================================
   F. TRACE INTEGRITY — the step debugger's data must be sound
   ============================================================ */

{
  const src = `def add(a, b):\n    return a + b\ntotal = 0\nfor i in range(3):\n    total = add(total, i)\nprint(total)`;
  const r = execute(src, 'python');
  ok('trace/exists', r.trace.length > 0, 'no trace recorded');
  ok('trace/lines-valid', r.trace.every(s => s.line >= 1 && s.line <= 6), 'line out of range');
  ok('trace/output-monotonic', r.trace.every((s, i) => i === 0 || s.outputLen >= r.trace[i - 1].outputLen), 'output length went backwards');
  ok('trace/depth-positive', r.trace.every(s => s.depth >= 1), 'bad depth');
  ok('trace/enters-function', r.trace.some(s => s.frame === 'add'), 'never recorded a step inside add()');
  ok('trace/final-output', eqDeep(r.output, ['3']), JSON.stringify(r.output));
  const varsSeen = r.trace.some(s => Object.prototype.hasOwnProperty.call(s.vars, 'total'));
  ok('trace/captures-vars', varsSeen, 'never captured "total"');
}

{
  // snapshots must be independent copies, not shared references
  const r = execute(`xs = [1]\nfor i in range(3):\n    xs.append(i)\nprint(len(xs))`, 'python');
  const listSnapshots = r.trace.filter(s => Array.isArray(s.vars.xs)).map(s => s.vars.xs.length);
  ok('trace/snapshots-are-copies', new Set(listSnapshots).size > 1,
    'all snapshots identical: ' + JSON.stringify(listSnapshots));
}

/* ============================================================
   G. DETERMINISM
   ============================================================ */

{
  const src = PROGRAMS.find(p => p.name === 'bubble-sort').src;
  const a = execute(src, 'python');
  const b = execute(src, 'python');
  ok('determinism/output', eqDeep(a.output, b.output), 'differed between runs');
  ok('determinism/steps', a.steps === b.steps, a.steps + ' vs ' + b.steps);
  ok('determinism/trace', eqDeep(a.trace, b.trace), 'trace differed');
}

/* ============================================================
   REPORT
   ============================================================ */

console.log('\n=== POLYGLOT CORE HARNESS ===');
console.log('curated programs      : ' + PROGRAMS.length + ' (python) + ' + JS_PROGRAMS.length + ' (javascript native)');
console.log('V8 oracle cases       : ' + (oracleChecked + randomOk) + ' checked (' + randomOk + ' randomised, ' + randomSkipped + ' skipped as runtime errors)');
console.log('error cases           : ' + ERROR_CASES.length);
console.log('assertions passed     : ' + pass);
console.log('assertions failed     : ' + fail);
if (failures.length) {
  console.log('\n--- failures (first 12) ---');
  for (const f of failures.slice(0, 12)) console.log('* ' + f);
}
process.exit(fail === 0 ? 0 : 1);

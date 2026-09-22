/* GAME-START */
/* ============================================================
   THE GAME LAYER
   Questions are generated from the interpreter's own trace, so the
   answer key is the execution itself, so it cannot disagree with the
   program. Seeded, therefore reproducible and testable.
   ============================================================ */

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function shuffled(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqueStrings(list, exclude) {
  const seen = new Set(exclude != null ? [exclude] : []);   // "" is a real answer, not an absent one
  const out = [];
  for (const s of list) {
    if (s == null) continue;
    const str = String(s);
    if (seen.has(str)) continue;
    seen.add(str);
    out.push(str);
  }
  return out;
}

/* ---------- question builders ---------- */

function qOutput(src, lang, r, rnd) {
  if (!r.output.length || r.output.length > 6) return null;
  const correct = r.output.join('\n');
  const cands = [];

  // nudge the first number that appears
  const bumped = r.output.map(l => l.replace(/-?\d+(\.\d+)?/, m => {
    const n = parseFloat(m);
    return String(Number.isInteger(n) ? n + 1 : Math.round((n + 0.5) * 100) / 100);
  }));
  if (bumped.join('\n') !== correct) cands.push(bumped.join('\n'));

  // one line short: the classic off-by-one
  if (r.output.length > 1) cands.push(r.output.slice(0, -1).join('\n'));

  // starts one late
  if (r.output.length > 1) cands.push(r.output.slice(1).join('\n'));

  // last two swapped
  if (r.output.length > 2) {
    const sw = r.output.slice();
    [sw[sw.length - 1], sw[sw.length - 2]] = [sw[sw.length - 2], sw[sw.length - 1]];
    cands.push(sw.join('\n'));
  }

  // nothing printed at all
  cands.push('(nothing)');

  const distract = uniqueStrings(cands, correct).slice(0, 3);
  if (distract.length < 2) return null;
  return {
    type: 'output',
    prompt: 'What does this program print?',
    code: src, lang, focusLine: 0, stepIndex: null,
    correct, distract, meta: {},
    explain: 'Run it and step through to watch each line print in turn.'
  };
}

function displayValue(v, lang, fmt) {
  return typeof v === 'string' ? '"' + v + '"' : fmt(v, lang);
}

function qValue(src, lang, r, rnd, fmt) {
  const usable = [];
  for (let i = 1; i < r.trace.length; i++) {
    const t = r.trace[i];
    for (const k of Object.keys(t.vars)) {
      if (t.vars[k] === null || Array.isArray(t.vars[k])) continue;
      usable.push({ step: i, name: k, value: t.vars[k], line: t.line });
    }
  }
  if (!usable.length) return null;

  const pick = usable[Math.floor(rnd() * usable.length)];
  const correct = displayValue(pick.value, lang, fmt);

  const others = [];
  for (const u of r.trace) {
    if (u.vars[pick.name] !== undefined && !Array.isArray(u.vars[pick.name]) && u.vars[pick.name] !== null) {
      others.push(displayValue(u.vars[pick.name], lang, fmt));
    }
  }
  if (typeof pick.value === 'number') {
    others.push(fmt(pick.value + 1, lang), fmt(pick.value - 1, lang), fmt(pick.value * 2, lang));
  }
  if (typeof pick.value === 'string') {
    others.push('""', '"' + pick.value + pick.value + '"');
  }
  const distract = uniqueStrings(shuffled(others, rnd), correct).slice(0, 3);
  if (distract.length < 2) return null;

  return {
    type: 'value',
    prompt: 'The program is paused just before line ' + pick.line + ' runs. What is ' + pick.name + ' right now?',
    code: src, lang, focusLine: pick.line, stepIndex: pick.step,
    correct, distract, meta: { name: pick.name, step: pick.step },
    explain: 'This is step ' + (pick.step + 1) + ' of ' + r.trace.length + '. Step to it yourself to check.'
  };
}

function qNextLine(src, lang, r, rnd) {
  const spots = [];
  for (let i = 0; i < r.trace.length - 1; i++) {
    if (r.trace[i + 1].line !== r.trace[i].line) spots.push(i);
  }
  if (!spots.length) return null;
  const i = spots[Math.floor(rnd() * spots.length)];
  const from = r.trace[i].line, to = r.trace[i + 1].line;

  const lineCount = src.split('\n').length;
  const all = [];
  for (let n = 1; n <= lineCount; n++) if (n !== to && n !== from) all.push(String(n));
  const distract = uniqueStrings(shuffled(all, rnd), String(to)).slice(0, 3);
  if (distract.length < 2) return null;

  return {
    type: 'nextline',
    prompt: 'Line ' + from + ' has just finished. Which line runs next?',
    code: src, lang, focusLine: from, stepIndex: i,
    correct: String(to), distract, meta: { step: i },
    explain: 'Programs do not always run from top to bottom. Loops jump back, and ifs skip ahead.'
  };
}

/* ---------- public: build a set of questions for a program ---------- */

function makeQuestions(src, lang, seed, count, engine) {
  const rnd = mulberry32(seed || 1);
  let r;
  try {
    r = engine.execute(src, lang, { maxSteps: 50000, maxTrace: 600 });
    if (r.error) return [];
  } catch (e) { return []; }

  const builders = shuffled([qOutput, qValue, qNextLine], rnd);
  const built = [];
  for (let pass = 0; pass < 3 && built.length < (count || 3); pass++) {
    for (const b of builders) {
      if (built.length >= (count || 3)) break;
      const q = b.length === 5
        ? b(src, lang, r, rnd, engine.fmt)
        : b(src, lang, r, rnd);
      if (!q) continue;
      if (built.some(x => x.type === q.type && x.prompt === q.prompt)) continue;
      const options = shuffled([q.correct].concat(q.distract), rnd);
      built.push({
        type: q.type, prompt: q.prompt, code: q.code, lang: q.lang,
        focusLine: q.focusLine, stepIndex: q.stepIndex, meta: q.meta || {},
        options, answer: options.indexOf(q.correct), explain: q.explain
      });
    }
  }
  return built;
}

/* ============================================================
   CRAFT CHECKS: best practice, judged on the parsed program
   rather than on the text, so formatting never fools them.
   ============================================================ */

function walkAst(node, visit) {
  if (Array.isArray(node)) { node.forEach(n => walkAst(n, visit)); return; }
  if (!node || typeof node !== 'object') return;
  if (node.kind) visit(node);
  for (const v of Object.values(node)) {
    if (v && typeof v === 'object') walkAst(v, visit);
  }
}

const CRAFT = {
  usesLoop: {
    label: 'Used a loop instead of repeating yourself',
    test: (ast) => { let f = false; walkAst(ast, n => { if (['ForRange', 'ForEach', 'While'].includes(n.kind)) f = true; }); return f; }
  },
  usesFunction: {
    label: 'Packaged the work in a function',
    test: (ast) => { let f = false; walkAst(ast, n => { if (n.kind === 'Func') f = true; }); return f; }
  },
  usesVariable: {
    label: 'Stored the value in a variable',
    test: (ast) => { let f = false; walkAst(ast, n => { if (n.kind === 'Assign') f = true; }); return f; }
  },
  descriptiveNames: {
    label: 'Named things so a stranger could read it',
    test: (ast) => {
      const names = [];
      walkAst(ast, n => {
        if (n.kind === 'Assign' && n.target && n.target.kind === 'Ident') names.push(n.target.name);
        if (n.kind === 'Func') names.push(n.name);
      });
      if (!names.length) return false;
      return names.every(n => n.length >= 3);
    }
  },
  fewPrints: {
    label: 'Let the loop do the printing',
    test: (ast) => {
      let c = 0;
      walkAst(ast, n => { if (n.kind === 'Call' && n.name === 'print') c++; });
      return c <= 2;
    }
  }
};

function checkCraft(name, ast) {
  const c = CRAFT[name];
  if (!c) return null;
  try { return { name, label: c.label, pass: !!c.test(ast) }; }
  catch (e) { return { name, label: c.label, pass: false }; }
}

/* ============================================================
   SCAFFOLDS
   A task's starting point is described once, language-neutrally:
   a note in the right comment style, plus optional code that gets
   translated. Adding a language costs nothing here.
   ============================================================ */
function starterFor(task, lang, engine) {
  if (task.override && task.override[lang]) return task.override[lang];
  const spec = engine.SPECS[lang];
  const marker = spec ? spec.comment : '#';
  const lines = [];
  if (task.scaffold && task.scaffold.note) lines.push(marker + ' ' + task.scaffold.note);
  if (task.scaffold && task.scaffold.code) {
    lines.push(lang === 'python' ? task.scaffold.code : engine.translate(task.scaffold.code, 'python', lang));
  } else lines.push('');
  return lines.join('\n');
}

function solutionFor(task, lang, engine) {
  if (!task.solution) return null;
  return lang === 'python' ? task.solution : engine.translate(task.solution, 'python', lang);
}

/* ============================================================
   MEASURED GROWTH
   The interpreter counts every step it takes, so instead of claiming
   a solution is too slow we can run it at two sizes and measure how
   its cost actually grows. Nothing here is a guess.
   ============================================================ */
function measureGrowth(src, lang, speed, engine) {
  const sizes = speed.sizes || [60, 120];
  const counts = [];
  let userAst;
  try { userAst = engine.parse(src, lang); }
  catch (e) { return { ok: false, reason: 'That program does not parse yet.' }; }

  for (const n of sizes) {
    let harness;
    const filled = speed.setup.replace(/\bN\b/g, String(n)).replace(/\bK\b/g, String(Math.floor(n / 2)));
    try { harness = engine.parse(filled, 'python'); }
    catch (e) { return { ok: false, reason: 'The speed harness is broken.' }; }
    const combined = { kind: 'Program', body: userAst.body.concat(harness.body) };
    let r;
    try { r = engine.run(combined, { lang, maxSteps: 4000000, maxTrace: 1 }); }
    catch (e) { return { ok: false, reason: 'It could not be run at size ' + n + '.' }; }
    if (r.error) return { ok: false, reason: 'At size ' + n + ' it stopped: ' + r.error.message };
    counts.push(r.steps);
  }

  // Building the input costs steps of its own. For a fast solution that cost can
  // swamp the measurement, so subtract what an empty answer would have taken.
  let net = counts;
  if (speed.baseline) {
    const base = [];
    for (const n of sizes) {
      let stubAst, harness;
      try {
        stubAst = engine.parse(speed.baseline, 'python');
        harness = engine.parse(speed.setup.replace(/\bN\b/g, String(n)).replace(/\bK\b/g, String(Math.floor(n / 2))), 'python');
      } catch (e) { return { ok: false, reason: 'The speed harness is broken.' }; }
      const r = engine.run({ kind: 'Program', body: stubAst.body.concat(harness.body) },
        { lang: 'python', maxSteps: 4000000, maxTrace: 1 });
      if (r.error) return { ok: false, reason: 'The baseline could not be measured.' };
      base.push(r.steps);
    }
    net = counts.map((c, i) => Math.max(1, c - base[i]));
  }

  const growth = Math.log(net[1] / net[0]) / Math.log(sizes[1] / sizes[0]);
  const shown = Math.round(growth * 100) / 100;
  const bands = { logarithmic: [-0.5, 0.55], linear: [0.55, 1.45], quadratic: [1.45, 2.6] };
  const band = bands[speed.target] || bands.linear;
  const pass = growth >= band[0] && growth < band[1];
  return {
    ok: true, pass, growth: shown, counts: net, sizes,
    label: 'measured growth about n^' + shown.toFixed(2),
    verdict: pass
      ? 'That is ' + speed.target + ', which is the target.'
      : 'The target is ' + speed.target + '. This is closer to n^' + shown.toFixed(2) + ', so it will not scale.'
  };
}

/* A round of "which technique is this", with every pattern always on offer
   so the answer has to come from the statement rather than from elimination. */
function makeRecognitionRound(bank, names, seed, count) {
  const rnd = mulberry32(seed || 1);
  const picked = [];
  const used = {};
  const keys = Object.keys(names);
  for (let guard = 0; guard < 200 && picked.length < (count || 5); guard++) {
    const i = Math.floor(rnd() * bank.length);
    if (used[i]) continue;
    used[i] = 1;
    const item = bank[i];
    const options = shuffled(keys.map(k => names[k]), rnd);
    picked.push({
      type: 'recognise',
      prompt: item.text,
      code: '', lang: null, focusLine: 0, stepIndex: null, meta: { pattern: item.pattern },
      options,
      answer: options.indexOf(names[item.pattern]),
      explain: item.why
    });
  }
  return picked;
}

const GAME = { makeQuestions, checkCraft, CRAFT, mulberry32, starterFor, solutionFor, displayValue, measureGrowth, makeRecognitionRound };
/* GAME-END */

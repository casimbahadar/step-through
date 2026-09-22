/* content-tests.mjs — ported in the Fable 5 handoff session to the shipped
   file's current shapes. The pre-redesign version (per-language `starter`
   fields) died with the old session; this port keeps its sections and rules:
   A structure, B no-freebie, C solutions, D hints, E craft, F demos,
   G generated questions — and adds H for the Spot-the-pattern drill, which
   postdates the old harness copy. Solutions/demos/starters are additionally
   checked in-engine across ALL editable languages, not only python+js. */
import { loadParts } from './loadparts.mjs';

const from = process.argv[2] === 'shipped' ? 'shipped' : 'src';
const { POLYGLOT, GAME, LESSONS, RECOGNISE, PATTERN_NAMES } = loadParts(from);
const { execute, translate, parse } = POLYGLOT;
const EDITABLE = Object.keys(POLYGLOT.SPECS);

let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };
const eqDeep = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const norm = a => a.map(x => String(x)
  .replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null')
  .replace(/(-?\d+)\.0(?=\b|$)/g, '$1'));

const graded = [];
for (const L of LESSONS) for (const t of L.tasks) if (t.expect) graded.push({ L, t });
const langsFor = L => EDITABLE.filter(l => !(L.unavailable || []).includes(l));

/* ============================================================
   A. STRUCTURE
   ============================================================ */
{
  const ids = new Set(), taskIds = new Set();
  let dupL = 0, dupT = 0;
  for (const L of LESSONS) {
    if (ids.has(L.id)) dupL++; ids.add(L.id);
    for (const t of L.tasks) { if (taskIds.has(t.id)) dupT++; taskIds.add(t.id); }
  }
  ok('structure/unique-lesson-ids', dupL === 0, dupL + ' duplicates');
  ok('structure/unique-task-ids', dupT === 0, dupT + ' duplicates');
  for (const L of LESSONS) {
    ok('structure/teach/' + L.id, Array.isArray(L.teach) && L.teach.length >= 1, 'no teaching blocks');
    ok('structure/practice/' + L.id, !!(L.practice && L.practice.h && L.practice.p), 'no best-practice note');
    ok('structure/demo/' + L.id, !!(L.demo && L.demo.code), 'no worked example');
    for (const b of L.teach) {
      const bothLangs = typeof b.p === 'string' || (b.p && b.p.python && b.p.javascript);
      ok('structure/teach-langs/' + L.id, bothLangs, 'a teaching block is missing a language variant');
    }
    for (const t of L.tasks) {
      ok('structure/prompt/' + t.id, typeof t.prompt === 'string' && t.prompt.length > 10, 'prompt too thin');
      if (!t.expect) continue;
      ok('structure/scaffold/' + t.id, !!t.scaffold, 'no scaffold');
      for (const lang of langsFor(L)) {
        let s;
        try { s = GAME.starterFor(t, lang, POLYGLOT); } catch (e) { s = null; }
        ok('structure/starter/' + t.id + '/' + lang, typeof s === 'string', 'scaffold failed to build');
      }
    }
  }
}

/* ============================================================
   B. THE CENTRAL RULE — a starter must never be the answer
   ============================================================ */
for (const { L, t } of graded) {
  for (const lang of langsFor(L)) {
    let gives = false, detail = '';
    try {
      const starter = GAME.starterFor(t, lang, POLYGLOT);
      const r = execute(starter, lang, { maxSteps: 50000, inputs: t.inputs || [] });
      if (!r.error && eqDeep(norm(r.output), norm(t.expect))) { gives = true; detail = 'starter already produces the expected output'; }
    } catch (e) { /* a starter that will not even parse certainly does not give the answer */ }
    ok('no-freebie/' + t.id + '/' + lang, !gives, detail);
  }
}

/* ============================================================
   A2. PATTERN NAMES — every pattern lesson gives the standard name a learner
   can search for, and the drill's option labels match the lesson titles
   ============================================================ */
for (const L of LESSONS) {
  if (L.level !== 'Problems' || L.id.indexOf('check-') === 0) continue;
  ok('known-name/' + L.id, typeof L.known === 'string' && L.known.length >= 5, 'no standard name given');
  if (PATTERN_NAMES[L.id]) ok('drill-label-matches-title/' + L.id, PATTERN_NAMES[L.id] === L.title,
    'drill says "' + PATTERN_NAMES[L.id] + '", lesson says "' + L.title + '"');
}

/* ============================================================
   B2. FIELD-NAME LINT — some languages read `.length`/`.size`/`.Count`
   as the length property, so a user field with one of those names is
   silently shadowed there. Curriculum content must never use them.
   ============================================================ */
{
  const banned = new Set();
  for (const spec of Object.values(POLYGLOT.SPECS)) {
    if (spec.len && spec.len.style === 'property') banned.add(spec.len.name);
    if (spec.listOps && spec.listOps.strLen && spec.listOps.len !== 'call') banned.add(spec.listOps.strLen);
  }
  const walk = (n, v) => { if (Array.isArray(n)) { n.forEach(x => walk(x, v)); return; } if (!n || typeof n !== 'object') return; v(n); for (const x of Object.values(n)) if (x && typeof x === 'object') walk(x, v); };
  for (const L of LESSONS) {
    const srcs = [['demo', L.demo.code]];
    for (const t of L.tasks) if (t.solution) srcs.push([t.id, t.solution]);
    for (const [id, s] of srcs) {
      let bad = [];
      try { walk(parse(s, 'python'), n => { if (n.kind === 'Assign' && n.target && n.target.kind === 'Attr' && banned.has(n.target.name)) bad.push(n.target.name); }); } catch (e) { }
      ok('fieldlint/' + L.id + '/' + id, bad.length === 0, 'field named ' + bad.join(',') + ' shadows a length property (banned: ' + [...banned].join(', ') + ')');
    }
  }
}

/* ============================================================
   B3. FUNCTION-NAME LINT — a curriculum function must not collide with a
   builtin of any target language. PHP defines join(), so a lesson that
   named its own function join() was a fatal redeclare there.
   ============================================================ */
{
  const banned = new Set(['join', 'list', 'count', 'sort', 'key', 'current', 'next', 'reset',
    'end', 'array', 'print', 'echo', 'range', 'map', 'filter', 'min', 'max', 'abs', 'str', 'len']);
  const walk = (n, v) => { if (Array.isArray(n)) { n.forEach(x => walk(x, v)); return; } if (!n || typeof n !== 'object') return; v(n); for (const x of Object.values(n)) if (x && typeof x === 'object') walk(x, v); };
  for (const L of LESSONS) {
    const srcs = [['demo', L.demo.code]];
    for (const t of L.tasks) if (t.solution) srcs.push([t.id, t.solution]);
    for (const [id, src] of srcs) {
      const bad = [];
      try { walk(parse(src, 'python'), n => { if (n.kind === 'Func' && banned.has(n.name)) bad.push(n.name); }); } catch (e) { }
      ok('fnlint/' + L.id + '/' + id, bad.length === 0, 'defines ' + bad.join(',') + ', which is a builtin in at least one target language');
    }
  }
}

/* ============================================================
   C. SOLUTIONS ARE CORRECT — in every language the lesson offers
   ============================================================ */
for (const { L, t } of graded) {
  for (const lang of langsFor(L)) {
    let r;
    try {
      const src = lang === 'python' ? t.solution : translate(t.solution, 'python', lang);
      r = execute(src, lang, { maxSteps: 200000, inputs: t.inputs || [] });
    } catch (e) { ok('solution/' + lang + '/' + t.id, false, 'threw: ' + e.message); continue; }
    ok('solution/' + lang + '/' + t.id, !r.error && eqDeep(norm(r.output), norm(t.expect)),
      r.error ? r.error.message : JSON.stringify(r.output) + ' wanted ' + JSON.stringify(t.expect));
  }
}

/* ============================================================
   D. HINT LADDERS
   ============================================================ */
for (const { t } of graded) {
  ok('hints/exist/' + t.id, Array.isArray(t.hints) && t.hints.length >= 2, (t.hints || []).length + ' hints');
  const allText = (t.hints || []).every(h => typeof h === 'string' ? h.length > 15 : (h.python && h.javascript));
  ok('hints/substantial/' + t.id, allText, 'a hint is empty or missing a language variant');
  // a hint must not simply be the answer pasted in
  const leaks = (t.hints || []).some(h => typeof h === 'string' && t.solution && h.includes(t.solution.split('\n')[0].trim()) && t.solution.split('\n')[0].trim().length > 12);
  ok('hints/no-leak/' + t.id, !leaks, 'a hint contains the solution line verbatim');
}

/* ============================================================
   E. CRAFT CHECKS — the third star must be earnable and meaningful
   ============================================================ */
for (const { t } of graded) {
  if (!t.craft) continue;
  const ast = parse(t.solution, 'python');
  const res = GAME.checkCraft(t.craft, ast);
  ok('craft/known/' + t.id, !!res, 'unknown craft check: ' + t.craft);
  ok('craft/solution-passes/' + t.id, res && res.pass, 'the model solution fails its own craft check');
}
{
  // and the check must actually discriminate: a deliberately clumsy program should fail it
  const clumsy = parse('print(1)\nprint(2)\nprint(3)\nprint(4)\nprint(5)', 'python');
  ok('craft/discriminates-loop', GAME.checkCraft('usesLoop', clumsy).pass === false, 'usesLoop passed a copy-paste program');
  ok('craft/discriminates-prints', GAME.checkCraft('fewPrints', clumsy).pass === false, 'fewPrints passed five prints');
  const shortNames = parse('a = 1\nprint(a)', 'python');
  ok('craft/discriminates-names', GAME.checkCraft('descriptiveNames', shortNames).pass === false, 'descriptiveNames passed "a"');
}

/* ============================================================
   F. DEMOS RUN CLEANLY — in every language the lesson offers
   ============================================================ */
for (const L of LESSONS) {
  for (const lang of langsFor(L)) {
    let r;
    try {
      const src = lang === 'python' ? L.demo.code : translate(L.demo.code, 'python', lang);
      r = execute(src, lang, { maxSteps: 200000, inputs: L.demo.inputs || [] });
    } catch (e) { ok('demo/' + L.id + '/' + lang, false, 'threw: ' + e.message); continue; }
    ok('demo/' + L.id + '/' + lang, !r.error && r.output.length > 0, r.error ? r.error.message : 'produced no output');
  }
}

/* ============================================================
   G. GENERATED QUESTIONS — exactly one true answer, always
   ============================================================ */
const sources = [];
for (const L of LESSONS) {
  if (!(L.demo.inputs || []).length) sources.push({ src: L.demo.code, skip: L.unavailable || [] });
  for (const t of L.tasks) if (t.solution && !(t.inputs || []).length) sources.push({ src: t.solution, skip: L.unavailable || [] });
}

let qTotal = 0, qGood = 0;
const byType = {};
for (const { src, skip } of sources) {
  for (const lang of ['python', 'javascript']) {
    if (skip.includes(lang)) continue;
    const code = lang === 'python' ? src : translate(src, 'python', 'javascript');
    for (let seed = 1; seed <= 12; seed++) {
      const qs = GAME.makeQuestions(code, lang, seed, 3, POLYGLOT);
      for (const q of qs) {
        qTotal++;
        byType[q.type] = (byType[q.type] || 0) + 1;
        const problems = [];
        if (q.options.length < 3) problems.push('fewer than 3 options');
        if (new Set(q.options).size !== q.options.length) problems.push('duplicate options');
        if (!(q.answer >= 0 && q.answer < q.options.length)) problems.push('answer index out of range');

        // re-derive the truth from a fresh execution rather than trusting the generator
        const fresh = execute(code, lang, { maxSteps: 50000, maxTrace: 600 });
        const stated = q.options[q.answer];
        if (q.type === 'output') {
          if (stated !== fresh.output.join('\n')) problems.push('stated output answer is wrong');
        } else if (q.type === 'value') {
          const t = fresh.trace[q.meta.step];
          const shown = v => GAME.displayValue ? GAME.displayValue(v, lang, POLYGLOT.fmt) : POLYGLOT.fmt(v, lang);
          if (!t || shown(t.vars[q.meta.name]) !== stated) problems.push('stated variable answer is wrong');
        } else if (q.type === 'nextline') {
          const t = fresh.trace[q.meta.step + 1];
          if (!t || String(t.line) !== stated) problems.push('stated next-line answer is wrong');
        }
        // no distractor may accidentally also be true
        if (q.type === 'output') {
          const truth = fresh.output.join('\n');
          const dupTruth = q.options.filter(o => o === truth).length;
          if (dupTruth !== 1) problems.push('the true answer appears ' + dupTruth + ' times');
        }
        if (problems.length) failures.push('question/' + q.type + '/seed' + seed + ' :: ' + problems.join('; '));
        else qGood++;
      }
    }
  }
}
ok('questions/all-sound', qGood === qTotal, qGood + '/' + qTotal + ' sound');
pass += qGood;
ok('questions/volume', qTotal > 500, 'only ' + qTotal + ' generated');
ok('questions/variety', Object.keys(byType).length === 3, 'types seen: ' + Object.keys(byType).join(','));

/* determinism: the same seed must give the same quiz */
{
  const a = GAME.makeQuestions(LESSONS[5].demo.code, 'python', 99, 3, POLYGLOT);
  const b = GAME.makeQuestions(LESSONS[5].demo.code, 'python', 99, 3, POLYGLOT);
  ok('questions/deterministic', JSON.stringify(a) === JSON.stringify(b), 'same seed gave different questions');
  const c = GAME.makeQuestions(LESSONS[5].demo.code, 'python', 100, 3, POLYGLOT);
  ok('questions/seed-varies', JSON.stringify(a) !== JSON.stringify(c), 'different seeds gave identical questions');
}

/* ============================================================
   H. SPOT THE PATTERN — the recognition drill
   ============================================================ */
{
  ok('recognise/bank-present', Array.isArray(RECOGNISE) && RECOGNISE.length >= 8, (RECOGNISE || []).length + ' items');
  for (const item of RECOGNISE) {
    ok('recognise/known-pattern/' + item.pattern, !!PATTERN_NAMES[item.pattern], 'item names a pattern with no display name');
    ok('recognise/has-why', typeof item.why === 'string' && item.why.length > 20, 'missing or thin explanation');
    ok('recognise/has-text', typeof item.text === 'string' && item.text.length > 20, 'missing scenario text');
  }
  let rTotal = 0, rGood = 0;
  for (let seed = 1; seed <= 30; seed++) {
    const round = GAME.makeRecognitionRound(RECOGNISE, PATTERN_NAMES, seed, 5);
    const qs = Array.isArray(round) ? round : (round.questions || []);
    for (const q of qs) {
      rTotal++;
      const problems = [];
      const opts = q.options || [];
      if (opts.length < 3) problems.push('fewer than 3 options');
      if (new Set(opts).size !== opts.length) problems.push('duplicate options');
      if (!(q.answer >= 0 && q.answer < opts.length)) problems.push('answer index out of range');
      // re-derive the truth from the bank itself: the scenario is the prompt
      const bankItem = RECOGNISE.find(i => i.text === q.prompt);
      if (!bankItem) problems.push('question does not correspond to a bank item');
      else {
        if (opts[q.answer] !== PATTERN_NAMES[bankItem.pattern]) problems.push('stated answer is not the item\u2019s own pattern');
        if (q.meta && q.meta.pattern && q.meta.pattern !== bankItem.pattern) problems.push('meta disagrees with the bank');
      }
      if (problems.length) failures.push('recognise/seed' + seed + ' :: ' + problems.join('; '));
      else rGood++;
    }
  }
  ok('recognise/all-sound', rGood === rTotal, rGood + '/' + rTotal + ' sound');
  pass += rGood;
  const a = JSON.stringify(GAME.makeRecognitionRound(RECOGNISE, PATTERN_NAMES, 7, 5));
  const b = JSON.stringify(GAME.makeRecognitionRound(RECOGNISE, PATTERN_NAMES, 7, 5));
  ok('recognise/deterministic', a === b, 'same seed gave different rounds');
}

console.log('\n=== CURRICULUM + GAME HARNESS (' + from + ') ===');
console.log('lessons               : ' + LESSONS.length + ', graded tasks: ' + graded.length);
console.log('languages checked     : ' + EDITABLE.join(', '));
console.log('questions generated   : ' + qTotal + ' (' + Object.entries(byType).map(([k, v]) => k + ' ' + v).join(', ') + ')');
console.log('assertions passed     : ' + pass);
console.log('assertions failed     : ' + fail);
if (failures.length) { console.log('\n--- failures (first 15) ---'); failures.slice(0, 15).forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 && failures.length === 0 ? 0 : 1);

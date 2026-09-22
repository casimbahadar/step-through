import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync(new URL('./polyglot.html', import.meta.url), 'utf8');
let pass = 0, fail = 0; const failures = [];
const ok = (n, c, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? ' :: ' + d : '')); } };

const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
const w = dom.window, d = w.document;
const $ = id => d.getElementById(id);
const text = id => ($(id).textContent || '').replace(/\s+/g, ' ').trim();
const click = el => el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const type = src => { $('editor').value = src; $('editor').dispatchEvent(new w.Event('input', { bubbles: true })); };
const setLang = id => { $('langSel').value = id; $('langSel').dispatchEvent(new w.Event('change', { bubbles: true })); };

/* ---------- boot / learn ---------- */
ok('boot/core', !!w.POLYGLOT && !!w.GAME && !!w.LESSONS, 'a block failed to initialise');
ok('learn/teaching-shown', $('teachBlocks').querySelectorAll('.blk').length >= 3, 'teaching blocks missing');
ok('learn/practice-shown', text('practiceBox').includes('Good practice'), text('practiceBox').slice(0, 40));
ok('learn/demo-shown', $('demoCode').textContent.includes('Hello!'), 'demo missing');
ok('learn/no-controls-yet', $('buildControls').style.display === 'none', 'build controls visible during Learn');
click($('btnRunDemo'));
ok('learn/demo-runs', text('panelOut').includes('Hello!'), text('panelOut'));
ok('learn/output-complete-immediately', $('panelOut').querySelectorAll('.outline').length === 2, 'output was not shown in full straight after running');
ok('learn/step-starts-at-one', $('scrub').value === '0' && /^Step 1 of /.test(text('stepmeta')), text('stepmeta'));
ok('learn/demo-lamp', $('demoCode').querySelectorAll('.row.lit').length === 1, 'lamp not on demo');

/* ---------- predict ---------- */
click($('phPredict'));
ok('predict/questions-made', w.S.quiz.questions.length >= 2, 'no questions generated');
ok('predict/options-rendered', $('qOptions').querySelectorAll('.opt').length >= 3, 'options missing');
ok('predict/no-stepper', $('stepbar').style.display === 'none', 'stepper visible during quiz');
{
  const xpBefore = w.S.xp;
  const q = w.S.quiz.questions[0];
  click($('qOptions').querySelectorAll('.opt')[q.answer]);
  ok('predict/correct-verdict', text('qVerdict').includes('Right.'), text('qVerdict').slice(0, 60));
  ok('predict/awards-xp', w.S.xp > xpBefore, 'xp did not move');
  ok('predict/marks-right-option', $('qOptions').querySelectorAll('.opt.right').length === 1, 'right option not marked');
  ok('predict/locks-after-answer', $('qOptions').querySelectorAll('.opt')[0].disabled, 'options still clickable');
}
click($('btnQNext'));
{
  const q = w.S.quiz.questions[w.S.quiz.i];
  if (q) {
    const wrongIdx = (q.answer + 1) % q.options.length;
    const streakBefore = w.S.streak;
    click($('qOptions').querySelectorAll('.opt')[wrongIdx]);
    ok('predict/wrong-verdict', text('qVerdict').includes('Not this time'), text('qVerdict').slice(0, 60));
    ok('predict/wrong-reveals-answer', text('qVerdict').includes(q.options[q.answer].split('\n')[0]), 'answer not shown');
    ok('predict/streak-resets', w.S.streak === 0 && streakBefore > 0, 'streak did not reset');
  } else ok('predict/second-question', false, 'quiz too short');
}

/* ---------- build: the central complaint ---------- */
click($('phBuild'));
ok('build/controls-visible', $('buildControls').style.display === 'flex', 'controls hidden');
ok('build/tokenbar-visible', $('tokenbar').style.display === 'flex', 'token bar hidden');
ok('build/starter-is-scaffold', $('buildCode').textContent.includes('Write your instruction'), $('buildCode').textContent.slice(0, 60));
ok('build/starter-is-not-answer', !$('buildCode').textContent.includes('Good morning!'), 'the starter contains the answer');
click($('btnCheck'));
ok('build/starter-fails-check', text('panelOut').includes('Not there yet') || text('panelOut').includes('stopped before finishing'), text('panelOut').slice(0, 80));

/* three stars for solving unaided */
type('print("Good morning!")');
click($('btnCheck'));
ok('build/solves', text('panelOut').includes('Correct.'), text('panelOut').slice(0, 80));
ok('build/three-stars', (w.S.progress['speak-1']||{}).stars === 3, 'stars: ' + (w.S.progress['speak-1']||{}).stars);

/* hints cost a star, and climb one at a time */
w.loadTask(1);
ok('hints/none-shown-initially', $('hintBox').innerHTML === '', 'hint shown before asking');
click($('btnHint'));
ok('hints/one-at-a-time', $('hintBox').querySelectorAll('.hintbox > div').length === 1, 'wrong number of hints revealed');
click($('btnHint'));
ok('hints/climbs', $('hintBox').querySelectorAll('.hintbox > div').length === 2, 'ladder did not climb');
ok('hints/exhausted-disables', $('btnHint').disabled, 'hint button still enabled at top of ladder');
ok('hints/reveal-now-offered', $('btnReveal').style.display === 'inline-block', 'reveal not offered after hints run out');
type('print("Coffee")\nprint("Bagel")');
click($('btnCheck'));
ok('hints/two-stars', (w.S.progress['speak-2']||{}).stars === 2, 'stars: ' + (w.S.progress['speak-2']||{}).stars);

/* revealing costs two */
w.loadTask(2);
click($('btnHint')); click($('btnHint'));
click($('btnReveal'));
ok('reveal/loads-solution', $('buildCode').textContent.includes('Latte'), 'solution not loaded');
click($('btnCheck'));
ok('reveal/one-star', (w.S.progress['speak-3']||{}).stars === 1, 'stars: ' + (w.S.progress['speak-3']||{}).stars);

/* ---------- craft check gates the third star ---------- */
w.loadLesson(2);           // Remembering a value — unlocked below, so check the gate first
ok('lock/blocks-jump', w.S.lessonIndex === 0, 'jumped to a locked lesson');

/* ---------- full playthrough of the whole curriculum through the real UI ---------- */
let solved = 0, starTotal = 0;
for (let li = 0; li < w.LESSONS.length; li++) {
  w.loadLesson(li);
  if (w.S.lessonIndex !== li) { failures.push('playthrough/lesson' + li + ' :: still locked after finishing the previous one'); fail++; break; }
  w.setPhase('build');
  const L = w.LESSONS[li];
  for (let ti = 0; ti < L.tasks.length; ti++) {
    const t = L.tasks[ti];
    if (!t.expect) continue;
    w.loadTask(ti);
    type(t.solution);
    click($('btnCheck'));
    const p = w.S.progress[t.id];
    if (!p || !p.done) { failures.push('playthrough/' + t.id + ' :: solution rejected: ' + text('panelOut').slice(0, 90)); fail++; }
    else { solved++; starTotal += p.stars; pass++; }
  }
}
const gradedTotal = w.LESSONS.reduce((a, L) => a + L.tasks.filter(t => t.expect).length, 0);
ok('playthrough/every-task-solvable', solved === gradedTotal, solved + '/' + gradedTotal + ' solved through the interface');
ok('playthrough/model-solutions-earn-full-marks', starTotal === solved * 3, starTotal + ' stars from ' + solved + ' tasks');
ok('playthrough/xp-accumulated', w.S.xp > 200, 'xp: ' + w.S.xp);
ok('playthrough/unlocks-everything', w.LESSONS.every((_, i) => { w.loadLesson(i); return w.S.lessonIndex === i; }), 'a lesson stayed locked');

/* craft check specifically: short names lose the third star */
w.loadLesson(2); w.setPhase('build'); w.loadTask(0);
w.S.progress['var-1'] = { stars: 0, done: false };
type('a = 12\nb = 30\nprint(a + b)');
click($('btnCheck'));
ok('craft/clumsy-loses-star', w.S.progress['var-1'].stars === 2, 'stars: ' + w.S.progress['var-1'].stars);
ok('craft/tells-you-why', text('panelOut').includes('third star'), text('panelOut').slice(0, 120));

/* ---------- language ---------- */
w.loadLesson(0); w.setPhase('build'); w.loadTask(0);
setLang('javascript');
ok('lang/starter-swaps-not-translates', $('buildCode').textContent.includes('// Write your instruction'), $('buildCode').textContent.slice(0, 50));
type('console.log("Salaam!");');
setLang('python');
ok('lang/translates-your-work', $('buildCode').textContent.includes('print("Salaam!")'), $('buildCode').textContent.slice(0, 50));
type('print("unclosed');
setLang('javascript');
ok('lang/refuses-broken-code', text('panelOut').includes('switch language'), text('panelOut').slice(0, 70));
ok('lang/stays-put', w.S.lang === 'python', 'switched anyway');

/* ---------- ruby ---------- */
{
  const langs = Array.from($('langSel').options).map(o => o.value);
  ok('lang/picker-lists-all', langs.length === 9 && langs.includes('kotlin') && langs.includes('java'), langs.join(','));
  w.loadLesson(0); w.setPhase('build'); w.loadTask(0);
  setLang('ruby');
  ok('ruby/scaffold-uses-hash-comment', $('buildCode').textContent.includes('# Write your instruction'), $('buildCode').textContent.slice(0, 50));
  type('puts "Good morning!"');
  click($('btnCheck'));
  ok('ruby/checks-a-solution', text('panelOut').includes('Correct.'), text('panelOut').slice(0, 90));
  w.loadLesson(5); w.setPhase('learn');
  ok('ruby/demo-shows-end-blocks', $('demoCode').textContent.includes('end'), $('demoCode').textContent.slice(0, 80));
  w.setPhase('predict');
  ok('ruby/quiz-generates', w.S.quiz.questions.length >= 2, 'only ' + w.S.quiz.questions.length + ' questions in ruby');
  setLang('python');
}

/* ---------- exceptions ---------- */
{
  let ei = -1; w.LESSONS.forEach((L, i) => { if (L.id === 'errors') ei = i; });
  w.loadLesson(ei); w.setPhase('build'); w.loadTask(1);
  type('try:\n    raise Exception("out of stock")\nexcept Exception as err:\n    print(err)\nprint("after")');
  click($('btnCheck'));
  ok('errors/solves', text('panelOut').includes('Correct.'), text('panelOut').slice(0, 90));
  setLang('go');
  ok('errors/go-refuses', $('viewNote').style.display === 'block' && /cannot express/.test($('viewNote').textContent), 'go did not refuse');
  setLang('javascript');
  ok('errors/js-shape', /catch \(err\)/.test($('buildCode').textContent), $('buildCode').textContent.slice(0, 80));
  setLang('python');
}

/* ---------- the quiz hands you to the debugger ---------- */
{
  w.loadLesson(w.LESSONS.findIndex(L => L.id === 'loops')); w.setPhase('predict');
  const withStep = w.S.quiz.questions.findIndex(q => q.stepIndex != null);
  if (withStep >= 0) {
    w.S.quiz.i = withStep;
    w.S.quiz.answered = false;
    d.getElementById('qOptions').innerHTML = w.S.quiz.questions[withStep].options
      .map((o, i) => '<button class="opt" data-i="' + i + '">x</button>').join('');
    click($('qOptions').querySelectorAll('.opt')[0]);
    ok('quiz/offers-stepping', !!$('btnStepIt'), 'no step button after answering');
    click($('btnStepIt'));
    ok('quiz/steps-into-it', $('stepbar').style.display === 'flex' && w.S.runTarget === 'quiz', 'stepper did not open');
    ok('quiz/lamp-on-question', $('qCode').querySelectorAll('.row.lit').length === 1, 'no lamp on the quiz code');
  } else ok('quiz/offers-stepping', false, 'no steppable question generated');
}

/* ---------- side by side ---------- */
{
  w.loadLesson(w.LESSONS.findIndex(L => L.id === 'loops')); w.setPhase('build'); w.loadTask(1);
  type('total = 0\nfor i in range(1, 4):\n    total = total + i\nprint(total)');
  $('cmpSel').value = 'java';
  $('cmpSel').dispatchEvent(new w.Event('change', { bubbles: true }));
  ok('compare/opens', $('compare').style.display === 'block', 'compare pane hidden');
  ok('compare/shows-other-language', $('cmpCode').textContent.includes('public class Main'), $('cmpCode').textContent.slice(0, 60));
  click($('btnRun'));
  const max = parseInt($('scrub').max, 10);
  let both = 0;
  for (let i = 0; i <= max; i++) {
    $('scrub').value = String(i);
    $('scrub').dispatchEvent(new w.Event('input', { bubbles: true }));
    if ($('buildCode').querySelectorAll('.row.lit').length === 1 && $('cmpCode').querySelectorAll('.row.lit').length >= 1) both++;
  }
  ok('compare/lights-both-panes', both === max + 1, both + '/' + (max + 1) + ' steps lit in both');
  $('cmpSel').value = '';
  $('cmpSel').dispatchEvent(new w.Event('change', { bubbles: true }));
  ok('compare/turns-off', $('compare').style.display === 'none', 'still showing after off');
}

/* ---------- daily review ---------- */
{
  ok('review/has-a-pool', w.reviewPool().length > 0, 'nothing finished to review');
  w.startReview();
  ok('review/generates', w.S.quiz.questions.length >= 1 && w.S.reviewMode, w.S.quiz.questions.length + ' questions');
  ok('review/uses-predict-screen', $('secPredict').dataset.open === 'true' && $('qOptions').querySelectorAll('.opt').length >= 3, 'quiz screen not shown');
  ok('review/only-finished-work', w.reviewPool().every(x => w.S.progress[x.id] && w.S.progress[x.id].done), 'unfinished work leaked into review');
  w.setPhase('learn');
  ok('review/leaves-cleanly', w.S.reviewMode === false, 'review mode stuck on');
}

/* ---------- the drawer is grouped by level ---------- */
{
  const heads = Array.from(d.querySelectorAll('#lessonList .eyebrow')).map(e => (e.firstElementChild || e).textContent.trim());
  ok('drawer/levels', ['Basics','Intermediate','Advanced','Mastery'].every(l => heads.includes(l)), heads.join(' / '));
  ok('drawer/markup-group', heads.includes('HTML and CSS'), heads.join(' / '));
  ok('drawer/level-progress-shown', /\d+ of \d+ stars/.test(d.querySelector('#lessonList .eyebrow').textContent), d.querySelector('#lessonList .eyebrow').textContent);
}

/* ---------- dictionaries and text ---------- */
{
  let di = -1; w.LESSONS.forEach((L, i) => { if (L.id === 'dictionaries') di = i; });
  w.loadLesson(di); w.setPhase('build'); w.loadTask(0);
  type('prices = {"coffee": 3, "bagel": 4}\nprint(prices["coffee"])\nprint(len(prices))');
  click($('btnCheck'));
  ok('dict/solves', text('panelOut').includes('Correct.'), text('panelOut').slice(0, 90));
  setLang('ruby');
  ok('dict/ruby-fat-arrow', $('buildCode').textContent.includes('=>'), $('buildCode').textContent.slice(0, 60));
  setLang('java');
  ok('dict/java-has-no-literal', /put\(/.test($('buildCode').textContent), $('buildCode').textContent.slice(0, 90));
  setLang('go');
  ok('dict/go-refuses', $('viewNote').style.display === 'block', 'go did not refuse the dictionary lesson');
  setLang('python');
  type('prices = {"coffee": 3}\nwanted = "scone"\nprint(prices[wanted])');
  click($('btnRun'));
  ok('dict/missing-key-message', /no key/.test(text('panelOut')) && /It holds/.test(text('panelOut')), text('panelOut').slice(0, 120));
}

/* ---------- view-only languages ---------- */
{
  w.loadLesson(11); w.setPhase('build'); w.loadTask(0);   // functions lesson
  type('def twice(n):\n    return n * 2\nprint(twice(7))');
  setLang('java');
  ok('viewonly/renders-java', $('buildCode').textContent.includes('public class Main'), $('buildCode').textContent.slice(0, 60));
  /* view-only mode was removed late in the previous session — all nine
     languages are editable. Assert the editable behavior instead. */
  ok('alllangs/java-is-current-language', w.S.lang === 'java' && w.S.viewLang === null, w.S.lang + '/' + w.S.viewLang);
  ok('alllangs/java-runs-and-checks', !$('btnRun').disabled && !$('btnCheck').disabled, 'run/check disabled in java');
  ok('alllangs/no-read-only-note', $('viewNote').style.display === 'none', $('viewNote').textContent.slice(0, 60));
  ok('alllangs/edit-affordance-shown', $('tapEdit').style.display !== 'none', 'edit prompt hidden');
  setLang('csharp');
  ok('viewonly/switches-between', $('buildCode').textContent.includes('Console.WriteLine'), $('buildCode').textContent.slice(0, 60));
  setLang('go');
  ok('viewonly/go', $('buildCode').textContent.includes('func main()'), $('buildCode').textContent.slice(0, 60));
  setLang('php');
  ok('viewonly/php', $('buildCode').textContent.includes('$n'), $('buildCode').textContent.slice(0, 60));
  setLang('kotlin');
  ok('viewonly/kotlin', $('buildCode').textContent.includes('fun ') && $('buildCode').textContent.includes('fun main()'), $('buildCode').textContent.slice(0, 70));
  setLang('typescript');
  ok('viewonly/back-to-editable', w.S.viewLang === null && !$('btnRun').disabled, 'still locked after returning');
  ok('typescript/annotations', $('buildCode').textContent.includes(': number'), $('buildCode').textContent.slice(0, 80));
  type('function twice(n: number): number {\n  return n * 2;\n}\nconsole.log(twice(7));');
  click($('btnRun'));
  ok('typescript/runs', text('panelOut').includes('14'), text('panelOut').slice(0, 60));
  setLang('python');
}

/* ---------- object-oriented lessons ---------- */
{
  let polyIdx = -1;
  w.LESSONS.forEach((L, i) => { if (L.id === 'polymorphism') polyIdx = i; });
  w.loadLesson(polyIdx); w.setPhase('learn');
  ok('oop/lesson-loads', w.S.lessonIndex === polyIdx, 'polymorphism lesson did not open');
  click($('btnRunDemo'));
  ok('oop/demo-runs', /Rex says woof/.test(text('panelOut')) && /Whiskers says meow/.test(text('panelOut')), text('panelOut').slice(0, 80));
  ok('oop/self-in-variables', (() => {
    click($('tabVars'));
    for (let s2 = 0; s2 <= parseInt($('scrub').max, 10); s2++) {
      $('scrub').value = String(s2);
      $('scrub').dispatchEvent(new w.Event('input', { bubbles: true }));
      if (text('panelVars').includes('self.name')) return true;
    }
    return false;
  })(), 'never showed a field on self');
  setLang('java');
  ok('oop/java-renders-classes', $('demoCode').textContent.includes('class Dog extends Animal'), $('demoCode').textContent.slice(0, 70));
  setLang('kotlin');
  ok('oop/kotlin-open-override', /open class/.test($('demoCode').textContent) && /override fun/.test($('demoCode').textContent), $('demoCode').textContent.slice(0, 90));
  setLang('csharp');
  ok('oop/csharp-virtual-override', $('demoCode').textContent.includes('virtual') && $('demoCode').textContent.includes('override'), 'missing virtual/override');
  setLang('go');
  ok('oop/go-refuses-honestly', $('viewNote').style.display === 'block' && /cannot express/.test($('viewNote').textContent), $('viewNote').textContent.slice(0, 60));
  ok('oop/go-blocks-running', $('btnRunDemo').disabled, 'demo still runnable in a language without classes');
  setLang('ruby');
  ok('oop/ruby-classes', $('demoCode').textContent.includes('@name') && $('demoCode').textContent.includes('< Animal'), $('demoCode').textContent.slice(0, 70));
  setLang('python');
}

/* ---------- stepping still works inside Build ---------- */
w.loadLesson(0); w.setPhase('build'); w.loadTask(0);
type('total = 0\nfor i in range(1, 6):\n    total = total + i\nprint(total)');
click($('btnRun'));
const maxStep = parseInt($('scrub').max, 10);
ok('step/available-in-build', maxStep > 5, 'trace too short: ' + maxStep);
ok('step/starts-at-first-step', $('scrub').value === '0', 'slider did not start at step 1');
ok('step/output-not-hidden', $('panelOut').querySelectorAll('.outline').length === 1, 'output was hidden at step 1');
let lampOk = true;
for (let s = 0; s <= maxStep; s++) {
  $('scrub').value = String(s);
  $('scrub').dispatchEvent(new w.Event('input', { bubbles: true }));
  if ($('buildCode').querySelectorAll('.row.lit').length !== 1) { lampOk = false; break; }
}
ok('step/lamp-valid-every-step', lampOk, 'lamp missing at some step');

console.log('\n=== UI SMOKE TEST (headless DOM) ===');
console.log('curriculum played through : ' + solved + ' tasks solved via the interface, ' + starTotal + ' stars');
console.log('assertions passed         : ' + pass);
console.log('assertions failed         : ' + fail);
if (failures.length) { console.log('\n--- failures ---'); failures.slice(0, 15).forEach(f => console.log('* ' + f)); }
process.exit(fail === 0 ? 0 : 1);

import fs from 'node:fs';
import { loadParts } from './loadparts.mjs';
const { LESSONS, RECOGNISE, PATTERN_NAMES } = loadParts('shipped');
const html = fs.readFileSync(new URL('./polyglot.html', import.meta.url),'utf8');
const mk = html.match(/\/\* MARKUP-START \*\/([\s\S]*?)\/\* MARKUP-END \*\//)[1];
const { MARKUP_LESSONS } = new Function(mk + '\nreturn { MARKUP_LESSONS };')();

const items = [];   // [where, text]
const txt = v => typeof v === 'string' ? [v] : (v && typeof v === 'object' ? Object.values(v).filter(x=>typeof x==='string') : []);
for (const L of LESSONS) {
  items.push([L.id+'/title', L.title], [L.id+'/idea', L.idea]);
  for (const b of L.teach) { items.push([L.id+'/teach-h', b.h]); txt(b.p).forEach(t=>items.push([L.id+'/teach', t])); }
  items.push([L.id+'/practice-h', L.practice.h]); txt(L.practice.p).forEach(t=>items.push([L.id+'/practice', t]));
  if (L.demo.caption) items.push([L.id+'/caption', L.demo.caption]);
  for (const t of L.tasks) { items.push([t.id+'/prompt', t.prompt]); (t.hints||[]).forEach(h=>txt(h).forEach(x=>items.push([t.id+'/hint', x]))); }
}
for (const r of RECOGNISE) items.push(['drill/'+r.pattern+'/text', r.text], ['drill/'+r.pattern+'/why', r.why]);
for (const L of MARKUP_LESSONS) {
  items.push([L.id+'/title', L.title], [L.id+'/idea', L.idea||'']);
  for (const b of L.teach||[]) { items.push([L.id+'/teach-h', b.h]); txt(b.p).forEach(t=>items.push([L.id+'/teach', t])); }
  if (L.practice) { items.push([L.id+'/practice-h', L.practice.h]); txt(L.practice.p).forEach(t=>items.push([L.id+'/practice', t])); }
  for (const t of L.tasks||[]) { items.push([t.id+'/prompt', t.prompt]); (t.hints||[]).forEach(h=>txt(h).forEach(x=>items.push([t.id+'/hint', x]))); }
}
const syll = w => { w = w.toLowerCase().replace(/[^a-z]/g,''); if (!w) return 0; if (w.length<=3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,''); const m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1; };
let words=0, sents=0, sylls=0, emd=0, longS=[], semis=0;
for (const [w,t] of items) {
  if (!t) continue;
  emd += (t.match(/\u2014|\u2013/g)||[]).length; semis += (t.match(/;/g)||[]).length;
  for (const s of t.split(/(?<=[.!?])\s+/)) {
    const ws = s.split(/\s+/).filter(x=>/[A-Za-z]/.test(x)); if (!ws.length) continue;
    sents++; words += ws.length; sylls += ws.reduce((a,x)=>a+syll(x),0);
    if (ws.length > 28) longS.push([w, ws.length, s.slice(0,90)]);
  }
}
const fk = 0.39*(words/sents) + 11.8*(sylls/words) - 15.59;
console.log('text items            :', items.length, '| sentences', sents, '| words', words);
console.log('avg words / sentence  :', (words/sents).toFixed(1));
console.log('Flesch-Kincaid grade  :', fk.toFixed(1));
console.log('em/en dashes          :', emd);
console.log('semicolons            :', semis);
console.log('sentences over 28 words:', longS.length);
longS.slice(0,6).forEach(x=>console.log('   ', x[0], x[1]+'w:', x[2]));
const all = items.map(x=>x[1]).join(' ');
const jargon = ['iterate','iteration','algorithm','boolean','parameter','argument','syntax','quadratic','logarithmic','linear','recursion','recursive','complexity','representative','prerequisite','traverse','instantiate','inheritance','polymorphism','interface','scope','index','literal','hoist','n squared','O(n'];
console.log('\ntechnical terms and first appearance:');
for (const j of jargon) { const i = items.findIndex(x=>x[1] && x[1].toLowerCase().includes(j)); if (i>=0) console.log('   ', j.padEnd(16), (all.toLowerCase().split(j).length-1)+'x, first in', items[i][0]); }
const slop = [/\bnot just\b/i,/\bthe whole trick\b/i,/\bthe move\b/i,/\bis the gate\b/i,/\bsimply\b/i,/\bjust\b/i,/\bpowerful\b/i,/\bseamless/i,/\bleverage/i,/\brobust/i,/\bdelve/i,/\bunlock/i,/\bmagic/i,/\belegant/i];
console.log('\nphrases worth a look:');
for (const r of slop) { const hits = items.filter(x=>x[1] && r.test(x[1])); if (hits.length) console.log('   ', String(r).padEnd(20), hits.length+'x, e.g.', hits.slice(0,3).map(h=>h[0]).join(', ')); }

/* Gate: the house rule is no em or en dashes anywhere learners or developers read. */
const files = ['content.mjs', 'markup.mjs', 'ui.html', 'engine.mjs', 'game.mjs', 'docs/manifest.json', 'README.md', 'PROJECT-STATE.md', 'docs/DEPLOY.md'];
let dashHits = [];
for (const f of files) {
  const t = fs.readFileSync(new URL('./' + f, import.meta.url), 'utf8');
  const n = (t.match(/\u2014|\u2013|\\u2014|\\u2013|%E2%80%94/g) || []).length;
  if (n) dashHits.push(f + ': ' + n);
}
console.log('\nhouse rule, dashes in source :', dashHits.length ? dashHits.join(', ') : 'none');
process.exit(dashHits.length ? 1 : 0);

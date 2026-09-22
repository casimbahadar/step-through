/* RECONSTRUCTED in the Fable 5 handoff session — the original loadparts.mjs
   was not uploaded. Interface matches its callers (content-tests.mjs,
   multi-oracle.mjs) and its extraction mirrors build.py:
   'shipped' → extract CORE/GAME/CONTENT blocks from polyglot.html;
   'src'     → extract the same marker blocks from engine.mjs / game.mjs /
               content.mjs with `export ` prefixes stripped. */
import fs from 'node:fs';

const read = f => fs.readFileSync(new URL('./' + f, import.meta.url), 'utf8');

function block(src, name, where) {
  const m = src.match(new RegExp('/\\* ' + name + '-START \\*/([\\s\\S]*?)/\\* ' + name + '-END \\*/'));
  if (!m) throw new Error(name + ' block not found in ' + where);
  return m[1];
}

export function loadParts(from) {
  let core, game, content;
  if (from === 'shipped') {
    const html = read('polyglot.html');
    core = block(html, 'CORE', 'polyglot.html');
    game = block(html, 'GAME', 'polyglot.html');
    content = block(html, 'CONTENT', 'polyglot.html');
  } else {
    const strip = s => s.replace(/^export\s+/gm, '');
    core = strip(block(read('engine.mjs'), 'CORE', 'engine.mjs')) +
      "\nconst POLYGLOT = { SPECS, LangError, tokenize, parse, print, run, execute, translate, stripPos, normalize, fmt };\n";
    game = strip(block(read('game.mjs'), 'GAME', 'game.mjs'));
    content = strip(block(read('content.mjs'), 'CONTENT', 'content.mjs'));
  }
  return new Function(
    core + '\n' + game + '\n' + content +
    "\nreturn { POLYGLOT, GAME, LESSONS," +
    " PATTERN_NAMES: typeof PATTERN_NAMES !== 'undefined' ? PATTERN_NAMES : undefined," +
    " RECOGNISE: typeof RECOGNISE !== 'undefined' ? RECOGNISE : undefined };"
  )();
}

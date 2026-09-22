#!/usr/bin/env python3
"""Inline the verified engine, game layer, curriculum and markup track into one
self-contained HTML file. Updated in the Fable 5 handoff to match the shipped
polyglot.html structure: adds the MARKUP block and the current POLYGLOT tail
(translateWithMap, inferTypes). Round-trip verified byte-identical against the
shipped file of 2026-08-10."""
import re, pathlib, sys

here = pathlib.Path(__file__).parent
ui = (here / 'ui.html').read_text()

def block(fname, start, end):
    src = (here / fname).read_text()
    m = re.search(r'/\* %s \*/(.*)/\* %s \*/' % (start, end), src, re.S)
    if not m:
        sys.exit('markers %s/%s not found in %s' % (start, end, fname))
    return re.sub(r'^export\s+', '', m.group(1), flags=re.M)

core = ('/* CORE-START */\n' + block('engine.mjs', 'CORE-START', 'CORE-END') +
        "\nconst POLYGLOT = { SPECS, LangError, tokenize, parse, print, run, execute, translate, translateWithMap, inferTypes, stripPos, normalize, fmt };\n"
        "if (typeof window !== 'undefined') window.POLYGLOT = POLYGLOT;\n/* CORE-END */")
game = '/* GAME-START */\n' + block('game.mjs', 'GAME-START', 'GAME-END') + '/* GAME-END */'
content = '/* CONTENT-START */\n' + block('content.mjs', 'CONTENT-START', 'CONTENT-END') + '/* CONTENT-END */'
markup = '/* MARKUP-START */\n' + block('markup.mjs', 'MARKUP-START', 'MARKUP-END') + '/* MARKUP-END */'

for ph, blk in (('/*__CORE__*/', core), ('/*__GAME__*/', game),
                ('/*__CONTENT__*/', content), ('/*__MARKUP__*/', markup)):
    if ph not in ui:
        sys.exit('placeholder %s not found in ui.html' % ph)
    ui = ui.replace(ph, blk)

# Fonts are inlined so the file still works with no network (OFL, see LICENSE-OFL.txt)
import base64
def face(family, fname):
    data = base64.b64encode((here / fname).read_bytes()).decode()
    return ("@font-face{font-family:'%s';src:url(data:font/woff2;base64,%s) format('woff2');"
            "font-weight:200 800;font-style:normal;font-display:swap}" % (family, data))
if '/*__FONTS__*/' not in ui:
    sys.exit('placeholder /*__FONTS__*/ not found in ui.html')
ui = ui.replace('/*__FONTS__*/', face('Atkinson Next', 'sans.woff2') + '\n  ' + face('Atkinson Mono', 'mono.woff2'))

dest = here / 'polyglot.html'
dest.write_text(ui)
print('built %s  (%.1f KB)' % (dest.name, dest.stat().st_size / 1024))

#!/usr/bin/env python3
"""Derive the GitHub Pages copy from the built single file.

polyglot.html stays exactly as it is — self-contained, openable straight off a
phone with no server. The Pages copy differs in only two ways, both of which
need a real origin to work at all:

  1. the inline data: manifest becomes a real manifest.json (data: manifests are
     not reliably honoured for install-to-home-screen)
  2. a service worker is registered, so the app opens with no signal

Run `python3 build.py` first, then this.
"""
import pathlib, re, sys

here = pathlib.Path(__file__).parent
src = (here / 'polyglot.html').read_text()
out_dir = here   # published from the repository root: one flat folder, uploadable from a phone

link_re = re.compile(r'<link rel="manifest" href=\'data:application/manifest\+json,[^\']*\'>')
if not link_re.search(src):
    sys.exit('inline manifest link not found in polyglot.html — did build.py run?')
# Icons are fetched as "icon.png?v=N", where N is the CACHE version in sw.js. GitHub's servers,
# the app's offline copy and iOS itself all remember old icons; a new address defeats all three.
# Raising the version in sw.js is already the step for every update, so the icons follow for free.
ver_m = re.search(r"const CACHE = 'polyglot-v(\d+)'", (here / 'sw.js').read_text())
if not ver_m:
    sys.exit("could not read the CACHE version from sw.js")
V = ver_m.group(1)
ICONS = ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png']

src = link_re.sub('<link rel="manifest" href="manifest.json?v=%s">\n'
                  '<link rel="apple-touch-icon" href="apple-touch-icon.png?v=%s">' % (V, V), src)

# keep manifest.json and the offline precache list pointing at the same versioned addresses
import json
man_path = here / 'manifest.json'
man = json.loads(man_path.read_text())
for icon in man['icons']:
    icon['src'] = icon['src'].split('?')[0] + '?v=' + V
man_path.write_text(json.dumps(man, indent=2) + '\n')
sw_path = here / 'sw.js'
sw = sw_path.read_text()
shell = "const SHELL = ['./', './index.html', './manifest.json?v=%s', %s];" % (V, ', '.join("'./%s?v=%s'" % (n, V) for n in ICONS))
sw = re.sub(r"const SHELL = \[[^\]]*\];", shell, sw)
sw_path.write_text(sw)

REGISTER = """<script>
/* Registered only over http(s): opened as a file:// page there is no service
   worker to register, and inside a Claude artifact there is no sw.js to fetch. */
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
</script>
</body>"""
# The HTML/CSS track builds documents in JavaScript strings, so '</body>' occurs
# inside the inlined code as well. The document's own closing tag is the LAST one.
cut = src.rfind('</body>')
if cut < 0:
    sys.exit('no </body> in polyglot.html')
src = src[:cut] + REGISTER + src[cut + len('</body>'):]

out_dir.mkdir(exist_ok=True)
dest = out_dir / 'index.html'
dest.write_text(src)
print('built %s  (%.1f KB)' % (dest.relative_to(here), dest.stat().st_size / 1024))

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
out_dir = here / 'docs'   # GitHub Pages can serve a folder only if it is named docs

link_re = re.compile(r'<link rel="manifest" href=\'data:application/manifest\+json,[^\']*\'>')
if not link_re.search(src):
    sys.exit('inline manifest link not found in polyglot.html — did build.py run?')
src = link_re.sub('<link rel="manifest" href="manifest.json">', src)

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

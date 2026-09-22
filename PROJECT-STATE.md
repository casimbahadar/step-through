# Step Through: Learn to Code (formerly Polyglot): state and decisions

A single self-contained HTML file that teaches programming across nine languages, plus HTML/CSS.
Opens offline on a phone. Built entirely in chat; Casim is the author, Claude builds and advises.

## Build

- `python3 build.py` inlines `engine.mjs`, `game.mjs`, `content.mjs`, `markup.mjs` into `polyglot.html`.
- Never edit `polyglot.html` by hand: it is generated.
- Harnesses run against the **shipped file** (they extract the marked blocks from it), so what passes is what ships.

## Harnesses (all must be green: all green as of 2026-08-10, Fable 5 session)

| command | what it proves | last run |
|---|---|---|
| `node tests-shipped.mjs` | engine: parsing, printing, evaluation, V8 oracle | 2168/0 |
| `node content-tests.mjs shipped` | curriculum in all nine languages, no-freebie, field- and function-name lints, questions, recognition drill | 13488/0 |
| `node smoke.mjs` | interface in jsdom, incl. a full playthrough of every task | 180/0 |
| `node markup-oracle.mjs shipped` | HTML/CSS lessons rendered in real Chromium | 63/0 |
| `node ui-browser.mjs` | shipped file driven in real Chromium, both tracks | 12/0 |
| `node preflight.mjs` | phone-width layout, header stays on one line at 390 and 320px, zoom guard, 44px tap targets on five screens, embedded fonts load, console errors | 17/0 |
| `node multi-oracle.mjs shipped [langs]` | compiles/runs every program in ruby, php, go, java, kotlin, csharp, typescript | 932/0 |
| `node contrast-check.mjs` | rendered contrast of every visible text element, eight screens, light and dark, WCAG AA | 16/0 |
| `node theme-check.mjs` | Appearance control: default follows phone, Light/Dark override both ways, persists, browser bar follows, dark token lists identical | 18/0 |
| `node prose-audit.mjs` | reading level and sentence length of all learner text; fails on any em or en dash in source | grade 4.7, 0 dashes |
| `node pages-check.mjs` | the Pages copy over http: manifest, localStorage persistence, service worker, offline boot | 14/0 |

`multi-oracle` takes ~5 min for all languages. Run it in groups:
`ruby,php,go,csharp` (~35s) then `java,typescript` (~4 min) then `kotlin` (~4 min).
It feeds each program's scripted `inputs` on stdin (all seven runners, Kotlin included), and shims `prompt()` for
TypeScript under node (prompt is a browser API; the shim plays the browser's
part with the same answers the engine side gets).

## Environment (container resets between sessions: reinstall all of this)

- **Real Chromium**: `npm i @sparticuz/chromium puppeteer-core`: the binary ships
  *inside* the npm tarball, the only Chromium route through the network allowlist.
  Launch with `headless: 'shell'`, `--no-sandbox --disable-dev-shm-usage`.
- **apt is poisoned** by an unsigned nodesource repo: `rm /etc/apt/sources.list.d/nodesource.sources`
  then `apt-get update`, then `apt-get install -y --no-install-recommends ruby php-cli golang-go default-jdk-headless mono-mcs mono-runtime`.
- **Kotlin 2.0.21** from JetBrains' GitHub releases (apt's is from 2019): unzip to `/opt/kotlinc`.
- **TypeScript** via `npm i -g typescript`; **jsdom** locally.

## Architecture

One canonical AST. Nine language **specs** drive a shared tokenizer, parser and printer.
Adding a language is mostly a spec plus a few hooks: not a new parser.

- **Type inference** runs for every language (not just typed ones) because it is the only way to
  tell a map from a list, or text from a collection. It flows both ways: a parameter learns its
  shape from what the body does to it, and that flows back to the caller's variable.
- **Trace-based evaluation**: programs run to completion recording a step trace. That is what powers
  the stepper, the variable panel, the generated quiz questions, and the measured-growth feature.
- **`input()`** cannot pause a trace-based interpreter. Instead every keystroke re-runs the whole
  program with all answers so far. Deterministic programs make that exact.

## Decisions that cost time to reach: do not re-litigate

1. **Verify, never assert.** Every claim is backed by a harness. Six external toolchains are installed
   and used. Kotlin 2.0.21 came from JetBrains' GitHub releases because apt's is from 2019.
2. **Divergences are taught, not hidden.** Where languages genuinely disagree, the lesson says so and
   the language is excluded via `unavailable: [...]`:
   - Go has no inheritance, exceptions, or dictionary literals in our subset.
   - Java has no map literal (becomes `put` calls; round-trip test relaxes to *stability* there).
   - A missing dict key raises in Python/C# but returns nothing in JS/Ruby/PHP/Java: lessons raise explicitly.
   - Java/Kotlin/C# have a real `char` type, so iterating text is excluded there.
   - JavaScript's `sort` compares numbers as text; fixing it needs a comparator we cannot parse.
3. **`x.0` formatting** differs (Java/Kotlin/Ruby print `25.0`). Oracles normalise it; values are identical.
4. **Declare at first assignment** in Java/C#/Kotlin, except names first assigned inside a block,
   which are hoisted *without an initialiser* so they read back as declarations, not assignments.
5. **Float casts must survive parsing.** In Java/Kotlin/C#/Go a bare `/` is integer division, so the
   cast is the only thing marking true division.
6. **Storage picks itself.** `window.storage` inside a Claude artifact (localStorage is blocked
   there), `localStorage` everywhere else. One build serves both homes: superseded the old
   "switch it when it moves to Pages" plan, which would have forked the file.
24. **(2026-09-22) Visual identity: light paper, one highlighter.** Replaced the dark-chrome /
    single-amber-accent look and its tracked all-caps monospace labels (all stock generated-UI
    defaults). Yellow `#FFE45C` means only "the machine is here": the running line, the line just
    printed, the current task, the current lesson, the current phase. Buttons are ink, not a brand
    colour; green and red carry verdicts only. Labels are sentence case; no middle-dot meta strings.
    Numbering appears only where the content is a sequence (Learn, Predict, Build; the hint ladder).
    Dark mode follows the phone's setting (decision 27).
25. **(2026-09-22) Type is Atkinson Hyperlegible Next + Mono, embedded.** Chosen for the Braille
    Institute's character disambiguation (l/1/I, O/0, quotes): the exact misreadings lesson 1
    warns about. Both are SIL OFL variable fonts (~52 KB), inlined by `build.py` from `fonts/` so
    the app still works with no network. Preflight asserts both faces actually load.
26. **(2026-09-22) 44px tap targets on every screen**, per the usability canon (was a 24px floor,
    smallest real target 30px). Every text/background token pair passes WCAG AA; the light slate
    and gold were darkened to get there (comments on the highlighted line were 2.92:1).
27. **(2026-09-22) Dark mode follows `prefers-color-scheme`,** by swapping tokens only: no rule
    is written twice. The highlighter is the same yellow in both themes, and anything drawn ON it
    uses `--on-mark` (dark ink) in both, so the running line reads identically; the running line
    also re-declares the light-theme syntax colours, because those are the ones that read on
    yellow. Buttons use `--btn-bg/--btn-fg`, never `--ink`, since ink turns light in dark mode.
    `contrast-check.mjs` measures every visible text element in both themes; it was proven to
    fail by deliberately washing out one colour.
28. **(2026-09-22) Theme colours, manifest and icons now match the redesign.** The browser
    `theme-color` and both manifests still carried the old `#10212B`, and the icons were the old
    teal and amber. The icon is now the signature moment: a running line on the highlighter.
    `docs/sw.js` is at `polyglot-v2` for this deploy (decision 18).
29. **(2026-09-22) Appearance: Match phone / Light / Dark, in the menu drawer** (the header is
    full at 393px). `html[data-theme]` overrides the phone; the dark token list exists twice , 
    once under the media query guarded by `:not([data-theme="light"])`, once under
    `[data-theme="dark"]`: and `theme-check.mjs` fails if the two ever differ. A small script in
    `<head>` applies the saved choice before first paint; inside a Claude artifact localStorage is
    blocked, so the choice also goes to `window.storage` and is re-applied on load (verified in
    jsdom with localStorage throwing). Forced themes also pin the browser-bar `theme-color`.
30. **(2026-09-22) Plain-language pass over all learner text.** House rule: no em or en dashes
    anywhere, including code comments and UI strings (76 removed, each rewritten by hand as a
    period, comma, colon or parentheses; `prose-audit.mjs` now fails the build if one returns).
    Prose semicolons became two sentences (code such as `for (let i = 1; i < 6; i++)` untouched).
    Slogans and idioms rewritten ("it is Tuesday", "the whole trick", "catastrophically slow").
    The pattern-lesson headings are now "How to spot it / The slow way / The better way", not
    "The shape that gives it away / The waste / The move". Every technical word the app uses is
    taught where the idea is introduced: "parameter" in Functions, "linear/quadratic/logarithmic"
    in Complexity, since the growth verdict prints those words. Measured: 10.6 words per sentence,
    Flesch-Kincaid grade 4.7. "just"/"simply" kept where they mean "only" or "immediately".
31. **(2026-09-22) Pattern titles are plain instructions; each pattern names its standard term.**
    Titles follow the original lessons' style ("Slide the window", "Halve it every time"), so the
    playful ones changed: "Two speeds, one lap" is now "Send a fast and a slow marker", and
    likewise for prefix, unionfind, backtracking, matrix, intervals, bfs, toposort and complexity.
    Each Problems lesson (and recursion) has a `known` field shown under the summary as
    "Programmers call this breadth-first search, or BFS." so learners can search beyond the app.
    content-tests requires a name on every pattern and that the drill's option labels
    (`PATTERN_NAMES`) equal the lesson titles; contrast-check now visits a pattern lesson.
32. **(2026-09-22) Renamed from Polyglot to "Step Through: Learn to Code".** The full name is the
    page title and manifest `name`; "Step Through" is the header, manifest `short_name` and iOS
    home-screen label (about 12 characters fit under an icon). "Step through" is the real debugger
    phrase for what the stepper does. Lesson sentences that named the app now say "this app",
    because "Step Through writes both for you" reads as the verb. **Kept on purpose:** the build
    file `polyglot.html`, the `window.POLYGLOT` engine object, and the storage keys `polyglot:v2`
    and `polyglot:theme`, so existing progress and settings survive the rename.
33. **(2026-09-22) README.md, npm scripts, and the legacy test removed.** `npm run build`,
    `npm test` (11 s), `npm run test:browser` (45 s) and `npm run test:compilers`. The old
    `tests.mjs` was a pre-recovery copy that imported engine exports the build no longer has; it
    failed on load and `tests-shipped.mjs` replaces it. The prose audit's no-dash gate now also
    covers README.md, PROJECT-STATE.md and docs/DEPLOY.md.
34. **(2026-09-22) The web version lives in `docs/`, renamed from `pages/`,** because GitHub Pages
    can only publish a repository's root or a folder named `docs`. Set Pages to the main branch
    and `/docs`. Only files inside `docs/` are published, so `ui.html` and the other sources
    never reach the website. `.gitignore` keeps out `node_modules/`, the generated
    `polyglot.html`, and the design-review screenshot scripts; a fresh clone runs
    `npm install && npm run build` before testing.
7. **16px minimum on text-entry controls** (input/textarea/select), or iOS zooms on focus. The
   pre-flight enforces it, scoped to keyboard-summoning controls: range sliders and buttons are exempt.
8. **(2026-08-10) Curriculum fields may not be named `size`, `length`, `Count` or `Length`**: some
   parsers read those as the length property, silently shadowing the user's field (found when the
   Kotlin objects demo's `size` field parsed as `len(this)`). Enforced by `fieldlint` in content-tests;
   the demo field is now `capacity`.
9. **(2026-08-10) Ruby input prints `gets().chomp`**: real `gets` keeps the trailing newline, which
   broke the Project's room lookups under real Ruby (oracle-caught). The parser reads `.chomp` back
   off an input call, so round-trips stay clean.
10. **(2026-08-10) A C# constructor whose parent call moved into `: base(...)` may have an empty
    body.** The empty-block refusal (a teaching guard) still fires everywhere else.
11. **(2026-08-10) An empty list infers `unknown` and defaults to an int list only at print time**
    (via `printedElem`, used by all three type-printing sites). `xs.append(v)` teaches the list its
    element type, like `xs[k] = v` always did. Previously the empty literal was invented as `int`
    at inference time, which blocked learning and mistyped proj-4 under `tsc --strict`.
    Limit: the append flow teaches Ident receivers only, not `self.field.append(...)`: no
    curriculum program needs that today; extend it if one does.

12. **(2026-08-10) Console input in Java, Kotlin and C#.** Kotlin uses `readln()` (non-null
    since 1.6, so no `!!` to parse back). C# uses `Console.ReadLine()`, Java one shared
    `static java.util.Scanner __in`, declared **only when the program actually reads input** so
    every other program's output is unchanged, and dropped again by the wrapper's `dropRe`.
    Both qualified forms read back as `input()` through one parser hook.
13. **(2026-08-10) Java compares strings with `.equals`, never `==`.** A pre-existing printer bug
    invisible until the Project opened up in Java: `answer == "quit"` compares references, so the
    loop never ended and drained stdin. The printer emits `.equals(...)` (negated for `!=`) when
    either side is text; the parser reads it back as `==`. Numeric `==` is untouched.
14. **(2026-08-10) An empty list literal takes its element type from the declaration** via
    `EXPECT_TYPE`, the way Dict literals already did: otherwise C# printed
    `List<string> x = new List<int>{}`.

15. **(2026-09-11) The live preview replaces the iframe node; it never reassigns `srcdoc`.**
    Reassigning `srcdoc` while the previous srcdoc navigation is still in flight leaves the OLD
    document on screen permanently, while the attribute reads as the new one (reproduced in
    Chromium 152; a single set is fine, two in quick succession are not). Every keystroke after a
    pane re-render hit this. `renderPreview` now clones and replaces the frame.
16. **(2026-09-11) Browser harnesses must drive the markup track by typing, not by setting state.**
    Injecting `S.mHtml` is not equivalent: the app re-renders the preview from its own editor
    buffers, so an injected value is discarded on the next keystroke. `ui-browser.mjs` types into
    the HTML and CSS panes the way a person does: which is how bug 15 surfaced at all.

17. **(2026-09-11) The Pages copy is derived, never hand-maintained.** `make-pages.py` turns the
    built single file into `docs/index.html` by swapping the inline `data:` manifest for a real
    `manifest.json` and registering a service worker (guarded to http(s), so file:// and the
    artifact are unaffected). Insert the registration before the **last** `</body>`: the HTML/CSS
    track builds documents in JS strings, so earlier occurrences are inside code, and splicing
    there corrupts the MARKUP block. `pages-check.mjs` catches exactly that.
18. **(2026-09-11) Bump `CACHE` in `docs/sw.js` on every deploy.** Cache-first is deliberate (a
    lesson has to work with no signal), which means a stale cache is sticky without the bump.

19. **(2026-09-11) Go and PHP read input too.** PHP prints `trim(fgets(STDIN))` (an expression,
    via the new `inputExpr` spec field, parsed back by matching the trim/fgets call shape). Go gets
    a `bufio.Scanner` plus an `__input()` helper as a fixed prelude, emitted only when the program
    reads input and stripped again **as a whole block**: matching those lines individually would
    delete every bare `}` in the program.
20. **(2026-09-11) Curriculum functions may not be named after a builtin of any target language.**
    PHP defines `join()`, so a union-find lesson that defined `join()` was a fatal redeclare there.
    Enforced by `fnlint` in content-tests; the lesson's function is `unite()`.

21. **(2026-09-11) Kotlin reassigned parameters, fixed in the printer.** Kotlin parameters are
    `val`, so a body that reassigns one gets `var x = x` emitted at the top of the function;
    `stripParamCopies` drops that leading no-op again on read-back so round-trips stay stable.
    The union-find lesson deliberately reassigns its parameter, so the oracle re-proves this
    every run.
22. **(2026-09-11) A `for` header never re-declares a hoisted name** in Java/C#: if the name is
    already in `DECLARED`, the header emits `for (r = 0; ...)` instead of `for (int r = ...)`.
    The BFS lesson uses r and c as both loop and ordinary variables, which is what the matrix
    lesson's own practice note tells learners to do, so this too is covered every run.
23. **(2026-09-11) A value inside a dictionary literal inherits the map's value type.** An empty
    list as a dict value printed as `new List<int>()` inside a `Dictionary<string, List<string>>`.
    Same mechanism as decision 14, one level deeper: `EXPECT_TYPE` is now set per value while
    printing the pairs. Found by Mono on the toposort demo.

## Session history note (2026-08-10 handoff)

The Opus 5 session died of length; its container was lost. The shipped file was recovered as
source of truth, the src tree regenerated from its marker blocks (byte-identical round-trip
proven), markup-oracle.mjs and ui-browser.mjs recovered verbatim from the chat transcript,
loadparts.mjs reconstructed, content-tests ported to the current shapes, smoke synced to the
localized curriculum, preflight rebuilt. (The separate recovery notes were retired from the repository; this paragraph is their summary.)

## Content

48 lessons / 97 tasks, grouped by level in the drawer: Basics, Intermediate, Advanced, Mastery,
Problems, Project, Free play: plus a separate HTML + CSS track and two drills
("Daily review", "Spot the pattern").

Each level ends with a **checkpoint** combining everything in it.
The **Project** is a four-stage text adventure that is playable in-app and runs in
eight languages. Only Go is excluded, and not for input any more: Go has no
dictionary literal in our subset (decision 2) and the adventure is built on a room
dictionary.

Every task: scaffold that never contains the answer (enforced by test), hint ladder, "Show me",
stars (3 unaided / 2 with hints / 1 revealed, capped by craft and speed checks).

Examples are North American by request: no Urdu/Punjabi flavouring.

## Known gaps / next

- Patterns: **18 of 18: the set is complete** as of 2026-09-11. Recursion (Advanced) and
  complexity (Problems, with measured growth on both its tasks) now exist too.
- Rust and C++ both compile in this environment and would be verified like the rest.
- **Not yet playtested by a beginner.** That is the biggest gap and the only one Claude cannot
  close: but as of 2026-09-11 there is a deployable, installable copy to hand someone
  (`docs/`, see `docs/DEPLOY.md`), which is what that gap was waiting on.

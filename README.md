# Step Through: Learn to Code

A programming course that fits in one file and runs on a phone with no internet connection. You write real code in nine languages, and you watch it run one line at a time.

Formerly called Polyglot.

## What it teaches

- **48 lessons and 97 graded tasks**, in order: Basics, Intermediate, Advanced, Mastery, Problems, a four-stage Project, and Free play.
- **Nine languages from one set of lessons:** Python, JavaScript, TypeScript, Ruby, Go, Java, Kotlin, C# and PHP. Write a solution in one, then switch languages and see the same program written the way that language does it.
- **18 problem-solving patterns**, such as sliding window, binary search, breadth-first search and topological sort. Each lesson gives the standard name so a learner can look it up later. Complexity and recursion each get their own lesson.
- **A separate HTML and CSS track** of 6 lessons and 13 tasks, with a live preview.
- **Two drills:** "Daily review", and "Spot the pattern" (22 real-world problems where you name the technique without writing code).

## How a lesson works

Every lesson has three steps:

1. **Learn.** A short explanation, a good-practice note, and a worked example you can run.
2. **Predict.** Questions about what a program will print, or what a variable holds at a given moment. The questions are generated from the program's own run, so the answer key can never be wrong.
3. **Build.** Write the program yourself. The starting code never contains the answer, which a test enforces. Hints come in a numbered ladder, and "Show me" reveals a solution.

Tasks earn up to three stars: three unaided, two with hints, and one if you revealed the answer. A star can also be held back for sloppy code, like repeating yourself instead of using a loop.

The stepper is the heart of the app. After running a program you can move through it one step at a time, with the running line highlighted and every variable's value shown beside it.

## Using it

- **Appearance:** open the ☰ menu. "Match phone" follows the phone's light or dark setting, while "Light" and "Dark" override it.
- **Progress** is saved on the device only. There is no account and nothing is sent anywhere. Clearing the browser's data clears your progress.
- **Offline:** once installed from the web version, it works with no signal.

## How it works

One interpreter handles all nine languages. Each language is described by a "spec" (its keywords, how it declares things, how it prints), and a shared parser turns any of them into the same internal form. That is why a solution written in Python can be shown in Kotlin: the app translates it rather than storing nine copies.

Programs run to completion while recording every step. That recording powers the stepper, the variable panel, the generated Predict questions, and a feature that measures how the work grows as the input doubles.

Programs that ask for typed input cannot pause halfway. Instead, every answer you type re-runs the program from the start with all your answers so far.

## Project layout

| Path | What it is |
|---|---|
| `engine.mjs` | The interpreter: tokenizer, parser, printer, type inference, and the nine language specs |
| `game.mjs` | Question generation, starter code, craft checks, growth measurement |
| `content.mjs` | The programming curriculum and the pattern drill |
| `markup.mjs` | The HTML and CSS track |
| `ui.html` | The page, its styles and its behaviour, with placeholders the build fills in |
| `fonts/` | Atkinson Hyperlegible Next and Mono, embedded so the app works offline |
| `build.py` | Combines everything into `polyglot.html` |
| `make-pages.py` | Makes the web version in `docs/` from the built file |
| `docs/` | The website GitHub Pages publishes: `index.html`, `manifest.json`, `sw.js`, `icons/` |
| `icons-draw.mjs` | Redraws the app icons into `docs/icons/` |
| `PROJECT-STATE.md` | Every decision that cost time to reach, and why. Read this before changing anything |

`polyglot.html` and `docs/index.html` are generated. Never edit either by hand. `polyglot.html` is not committed (see `.gitignore`), while `docs/index.html` is, because GitHub Pages serves it. The build file and the storage keys keep the old name on purpose, so nobody loses their progress in the rename.

Only `docs/` is published. `ui.html` and the other source files stay in the repository but never appear on the website.

## Building

Requires Python 3 and Node. It has been built and tested on Node 22. Older versions are untested.

```
npm install
npm run build
```

This writes `polyglot.html` (the single file you can open directly) and `docs/index.html` (the web version). A fresh clone needs this step before the tests, since they test the built file.

## Testing

Every harness tests the **built file**, not the source, so what passes is what ships.

```
npm test                  # engine, curriculum, interface, writing (under a minute)
npm run test:browser      # real Chromium: layout, contrast, theme, offline web version (about a minute)
npm run test:compilers    # real compilers for 7 languages (several minutes; Java and Kotlin are slowest)
```

| Harness | What it proves |
|---|---|
| `tests-shipped.mjs` | Parsing, printing and running, checked against Node's own JavaScript engine |
| `content-tests.mjs` | Every solution is correct in every language, no starter gives away the answer, every generated question has exactly one right answer |
| `smoke.mjs` | The whole interface, including solving all 97 tasks through it |
| `prose-audit.mjs` | Reading level of all lesson text, and the no-dash writing rule |
| `markup-oracle.mjs` | The HTML and CSS lessons, rendered in a real browser |
| `ui-browser.mjs` | The built file driven in real Chromium |
| `preflight.mjs` | Phone widths down to 320px, 44px tap targets, fonts loading, no page zoom on typing |
| `contrast-check.mjs` | Every piece of visible text meets WCAG AA contrast, in light and dark |
| `theme-check.mjs` | The Appearance setting, including that it survives a reload |
| `pages-check.mjs` | The web version over http: installable, saves progress, works offline |
| `multi-oracle.mjs` | Compiles and runs every program with the real Ruby, PHP, Go, Java, Kotlin, C# and TypeScript toolchains |

The compiler harness needs those toolchains installed. On Ubuntu:

```
apt-get install ruby php-cli golang-go default-jdk-headless mono-mcs mono-runtime
npm install -g typescript
```

Kotlin 2.0.21 comes from JetBrains' GitHub releases, unzipped to `/opt/kotlinc`, because the Ubuntu package is years out of date.

## Publishing on GitHub Pages

1. In the repository's Settings, open Pages, and choose your main branch and the `/docs` folder.
2. Before every later update, run `npm run build`, then raise the version in `docs/sw.js` (for example `polyglot-v2` to `polyglot-v3`). Without that, people who installed the app keep their old copy.

`docs/DEPLOY.md` has the details, including how to install it on iPhone and Android.

## Credits

- Fonts: Atkinson Hyperlegible Next and Atkinson Hyperlegible Mono by the Braille Institute, under the SIL Open Font License (`fonts/LICENSE-OFL.txt`). They were chosen because they keep easily confused characters apart, like l, 1 and I, or O and 0.
- Author: Casim ([github.com/casimbahadar](https://github.com/casimbahadar)).

No licence has been chosen for the code yet.

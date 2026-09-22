/* MARKUP-START */
/* ============================================================
   MARKUP TRACK: HTML and CSS
   These are not programming languages: nothing executes, nothing
   steps. So they get their own mode, and correctness is judged by
   rendering the page and asking the browser what it actually did.
   ============================================================ */

function runMarkupChecks(doc, win, checks) {
  const results = [];
  const all = sel => Array.from(doc.querySelectorAll(sel));
  const one = sel => doc.querySelector(sel);
  const norm = s => (s || '').replace(/\s+/g, ' ').trim();

  for (const c of checks) {
    let ok = false, msg = c.msg || '';
    try {
      if (c.kind === 'exists') {
        ok = !!one(c.sel);
        if (!ok) msg = 'Nothing on the page matches ' + c.sel + ' yet.';
      } else if (c.kind === 'count') {
        const n = all(c.sel).length;
        ok = c.exact != null ? n === c.exact : n >= (c.min || 1);
        if (!ok) msg = 'Found ' + n + ' of ' + c.sel + ', expected ' + (c.exact != null ? c.exact : 'at least ' + c.min) + '.';
      } else if (c.kind === 'text') {
        const el = one(c.sel);
        if (!el) { ok = false; msg = 'There is no ' + c.sel + ' to read yet.'; }
        else {
          const t = norm(el.textContent);
          ok = c.equals != null ? t === c.equals : t.toLowerCase().indexOf(String(c.contains).toLowerCase()) >= 0;
          if (!ok) msg = c.sel + ' says "' + t + '"' + (c.equals != null ? ', expected "' + c.equals + '".' : ', which does not mention "' + c.contains + '".');
        }
      } else if (c.kind === 'attr') {
        const el = one(c.sel);
        if (!el) { ok = false; msg = 'There is no ' + c.sel + ' yet.'; }
        else {
          const v = el.getAttribute(c.name);
          ok = c.nonEmpty ? !!(v && v.trim()) : v === c.equals;
          if (!ok) msg = c.sel + ' has ' + (v == null ? 'no ' + c.name + ' at all' : c.name + '="' + v + '"') +
            (c.equals != null ? ', expected "' + c.equals + '"' : '') + '.';
        }
      } else if (c.kind === 'style') {
        const el = one(c.sel);
        if (!el) { ok = false; msg = 'There is no ' + c.sel + ' to style yet.'; }
        else {
          const v = win.getComputedStyle(el)[c.prop];
          const wanted = c.oneOf || [c.equals];
          ok = wanted.indexOf(v) >= 0;
          if (!ok) msg = 'The ' + c.prop + ' of ' + c.sel + ' is ' + v + ', expected ' + wanted.join(' or ') + '.';
        }
      } else if (c.kind === 'styleNot') {
        const el = one(c.sel);
        if (!el) { ok = false; msg = 'There is no ' + c.sel + ' yet.'; }
        else {
          const v = win.getComputedStyle(el)[c.prop];
          ok = v !== c.equals;
          if (!ok) msg = 'The ' + c.prop + ' of ' + c.sel + ' is still ' + v + '.';
        }
      } else if (c.kind === 'sideBySide') {
        const els = all(c.sel);
        if (els.length < 2) { ok = false; msg = 'Need at least two ' + c.sel + ' to compare.'; }
        else {
          const a = els[0].getBoundingClientRect(), b = els[1].getBoundingClientRect();
          ok = b.left >= a.right - 1 && Math.abs(a.top - b.top) < 2;
          if (!ok) msg = 'Those boxes are still stacked one under the other rather than sitting in a row.';
        }
      } else if (c.kind === 'stacked') {
        const els = all(c.sel);
        if (els.length < 2) { ok = false; msg = 'Need at least two ' + c.sel + ' to compare.'; }
        else {
          const a = els[0].getBoundingClientRect(), b = els[1].getBoundingClientRect();
          ok = b.top >= a.bottom - 1;
          if (!ok) msg = 'Those boxes are side by side rather than stacked.';
        }
      } else if (c.kind === 'inside') {
        ok = !!one(c.sel);
        if (!ok) msg = 'Nothing matches ' + c.sel + '. Check what is nested inside what.';
      } else if (c.kind === 'outerWidth') {
        const el = one(c.sel);
        if (!el) { ok = false; msg = 'There is no ' + c.sel + ' yet.'; }
        else {
          const w = el.getBoundingClientRect().width;
          ok = Math.abs(w - c.px) <= (c.tolerance || 1);
          if (!ok) msg = c.sel + ' measures ' + Math.round(w) + 'px on screen, expected ' + c.px + 'px.';
        }
      } else if (c.kind === 'widthAtLeast') {
        const el = one(c.sel);
        ok = !!el && el.getBoundingClientRect().width >= c.px;
        if (!ok) msg = c.sel + ' is narrower than ' + c.px + 'px.';
      }
    } catch (e) { ok = false; msg = 'That check could not run: ' + e.message; }
    results.push({ ok, msg, label: c.msg || '' });
  }
  return results;
}

function markupDocument(html, css) {
  return '<!doctype html><html><head><meta charset="utf-8"><style>\n' + (css || '') + '\n</style></head><body>\n' + (html || '') + '\n</body></html>';
}

const MARKUP_LESSONS = [
{
  id: 'html-elements',
  title: 'What a page is made of',
  idea: 'Tags wrap content and say what it is.',
  teach: [
    { h: 'An element is a labelled piece of content',
      p: 'You write an opening tag, the content, then a closing tag with a slash. <p>Hello</p> is a paragraph whose content is Hello. The tags never appear on screen. They tell the browser what the thing is.' },
    { h: 'Elements sit inside other elements',
      p: 'Nesting is how structure is built, and it has to be tidy: an element opened inside another must close before that one does. Overlapping tags are the commonest beginner mistake and browsers silently rearrange them rather than complain.' },
    { h: 'HTML is not a programming language',
      p: 'Nothing here runs, loops or decides. There are no variables and no order of execution to step through. HTML describes; that is the whole job, and it is why this track has a preview instead of a debugger.' },
    { h: 'A few elements do most of the work',
      p: 'h1 to h6 are headings in order of importance, p is a paragraph, ul with li inside makes a list, a is a link and img is an image. Almost every page is mostly these.' }
  ],
  demo: {
    html: '<h1>Kitchener</h1>\n<p>A city in Ontario.</p>\n<ul>\n  <li>Founded 1854</li>\n  <li>Twin city: Waterloo</li>\n</ul>',
    css: 'body { font-family: system-ui, sans-serif; padding: 12px; }'
  },
  practice: { h: 'Pick the tag that means the thing',
    p: 'Use h1 because it is the main heading, not because it looks big. Screen readers, search engines and your future self all read the meaning, and appearance is CSS\u2019s job anyway.' },
  tasks: [
    { id: 'html-1', prompt: 'Add a main heading that says Toronto, and a paragraph underneath saying A city in Ontario.',
      scaffold: { html: '<!-- Write the heading and the paragraph here -->\n', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' },
      checks: [
        { kind: 'exists', sel: 'h1', msg: 'a main heading' },
        { kind: 'text', sel: 'h1', equals: 'Toronto', msg: 'the heading says Toronto' },
        { kind: 'exists', sel: 'p', msg: 'a paragraph' },
        { kind: 'text', sel: 'p', equals: 'A city in Ontario.', msg: 'the paragraph text matches' }
      ],
      hints: ['A main heading uses the h1 tag, opened and closed around the words.',
              'The paragraph goes on its own line underneath, wrapped in p tags.'],
      solution: { html: '<h1>Toronto</h1>\n<p>A city in Ontario.</p>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' } },

    { id: 'html-2', prompt: 'Add a list of exactly three items under the heading: Coffee, Bagel, Muffin.',
      scaffold: { html: '<h1>Menu</h1>\n<!-- A list goes here, with three items inside it -->\n', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' },
      checks: [
        { kind: 'exists', sel: 'ul', msg: 'a list' },
        { kind: 'count', sel: 'ul li', exact: 3, msg: 'exactly three items inside it' },
        { kind: 'text', sel: 'ul li', equals: 'Coffee', msg: 'the first item is Coffee' }
      ],
      hints: ['The list itself is one element; each item is another element nested inside it.',
              'ul wraps the whole list, and each li is one entry.'],
      solution: { html: '<h1>Menu</h1>\n<ul>\n  <li>Coffee</li>\n  <li>Bagel</li>\n  <li>Muffin</li>\n</ul>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' } },

    { id: 'html-3', prompt: 'This nesting is wrong: the list items are not inside a list. Fix it so all three sit inside one list.',
      scaffold: { html: '<h1>Menu</h1>\n<li>Coffee</li>\n<li>Bagel</li>\n<li>Muffin</li>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' },
      checks: [
        { kind: 'exists', sel: 'ul', msg: 'a list wrapper' },
        { kind: 'count', sel: 'ul > li', exact: 3, msg: 'all three items directly inside it' }
      ],
      hints: ['List items are not allowed to float on their own. They need a parent.',
              'Wrap all three in one ul, opening before the first and closing after the last.'],
      solution: { html: '<h1>Menu</h1>\n<ul>\n  <li>Coffee</li>\n  <li>Bagel</li>\n  <li>Muffin</li>\n</ul>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' } }
  ]
},

{
  id: 'html-attributes',
  title: 'Links, images and attributes',
  idea: 'Extra information written inside the opening tag.',
  teach: [
    { h: 'Attributes configure an element',
      p: 'They live inside the opening tag as name="value" pairs. <a href="https://example.com">visit</a> is a link whose destination is the href.' },
    { h: 'Some elements have no content',
      p: 'An image has nothing to wrap, so it has no closing tag: <img src="cat.jpg" alt="a cat">. Everything it needs is in its attributes.' },
    { h: 'alt is not optional',
      p: 'The alt text describes the image for anyone who cannot see it, and shows when the image fails to load. Leaving it out is the single most common accessibility failure on the web.' },
    { h: 'class marks elements for styling',
      p: 'class="card" attaches a label you can later target from CSS. It changes nothing on its own. It exists so the stylesheet can find the element.' }
  ],
  demo: {
    html: '<h1>Links</h1>\n<p><a href="https://example.com">A link</a> inside a paragraph.</p>\n<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'40\'><rect width=\'80\' height=\'40\' fill=\'%232E8B72\'/></svg>" alt="a green rectangle" width="80">',
    css: 'body { font-family: system-ui, sans-serif; padding: 12px; }'
  },
  practice: { h: 'Write the link text, not "click here"',
    p: 'A link\u2019s words should say where it goes when read on their own. People scanning a page and screen readers listing its links both see the text without the sentence around it.' },
  tasks: [
    { id: 'attr-1', prompt: 'Add a link to https://example.com whose text is Read more.',
      scaffold: { html: '<h1>Article</h1>\n<!-- Add the link here -->\n', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' },
      checks: [
        { kind: 'exists', sel: 'a', msg: 'a link' },
        { kind: 'attr', sel: 'a', name: 'href', equals: 'https://example.com', msg: 'it points at the right place' },
        { kind: 'text', sel: 'a', equals: 'Read more', msg: 'the words are Read more' }
      ],
      hints: ['A link is the a element, and its destination is an attribute in the opening tag.',
              'The visible words go between the opening and closing tags.'],
      solution: { html: '<h1>Article</h1>\n<a href="https://example.com">Read more</a>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' } },

    { id: 'attr-2', prompt: 'This image has no description. Give it an alt describing it as a green rectangle.',
      scaffold: {
        html: '<h1>Gallery</h1>\n<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'40\'><rect width=\'80\' height=\'40\' fill=\'%232E8B72\'/></svg>" width="80">',
        css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' },
      checks: [
        { kind: 'exists', sel: 'img', msg: 'the image is still there' },
        { kind: 'attr', sel: 'img', name: 'alt', nonEmpty: true, msg: 'it has a description' },
        { kind: 'attr', sel: 'img', name: 'alt', equals: 'a green rectangle', msg: 'the description matches' }
      ],
      hints: ['The description is another attribute in the same opening tag.',
              'Add alt="a green rectangle" alongside the src.'],
      solution: {
        html: '<h1>Gallery</h1>\n<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'40\'><rect width=\'80\' height=\'40\' fill=\'%232E8B72\'/></svg>" alt="a green rectangle" width="80">',
        css: 'body { font-family: system-ui, sans-serif; padding: 12px; }' } }
  ]
},

{
  id: 'css-selectors',
  title: 'Styling what you choose',
  idea: 'A selector picks elements; declarations say how they look.',
  teach: [
    { h: 'A rule has two halves',
      p: 'The selector chooses which elements, and the block in braces lists property: value pairs. h1 { color: teal; } means every h1 turns teal.' },
    { h: 'Three ways to choose',
      p: 'By tag name (p), by class with a dot (.card), or by id with a hash (#total). Classes are the workhorse: many elements can share one, and you can put several on the same element.' },
    { h: 'When rules disagree, the more specific one wins',
      p: 'An id beats a class, and a class beats a tag name. If two rules are equally specific, the one written later wins. Nearly every "why is my CSS not applying" moment is this rule.' },
    { h: 'Some properties are inherited',
      p: 'Set a font or a colour on body and everything inside gets it unless it says otherwise. Layout properties like width and padding are never inherited.' }
  ],
  demo: {
    html: '<h1>Heading</h1>\n<p class="lead">A lead paragraph.</p>\n<p>An ordinary paragraph.</p>',
    css: 'body { font-family: system-ui, sans-serif; padding: 12px; color: #333; }\nh1 { color: rgb(46, 139, 114); }\n.lead { font-size: 20px; font-weight: 600; }'
  },
  practice: { h: 'Reach for classes, not ids',
    p: 'An id can only appear once per page and outranks classes in ways that are hard to undo later. Classes stay reusable and predictable, which is what you want almost every time.' },
  tasks: [
    { id: 'css-1', prompt: 'Make every h1 on the page red, exactly rgb(255, 0, 0).',
      scaffold: { html: '<h1>Alert</h1>\n<p>Something happened.</p>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n/* Add your rule below */\n' },
      checks: [{ kind: 'style', sel: 'h1', prop: 'color', equals: 'rgb(255, 0, 0)', msg: 'the heading is red' }],
      hints: ['The selector is the tag name on its own, with no dot or hash.',
              'Inside the braces, set the color property. rgb(255, 0, 0) is exact red.'],
      solution: { html: '<h1>Alert</h1>\n<p>Something happened.</p>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\nh1 { color: rgb(255, 0, 0); }' } },

    { id: 'css-2', prompt: 'Only the paragraph marked as a note should be grey, rgb(128, 128, 128). Leave the other paragraph alone.',
      scaffold: { html: '<p class="note">A note.</p>\n<p>An ordinary paragraph.</p>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n/* Add your rule below */\n' },
      checks: [
        { kind: 'style', sel: '.note', prop: 'color', equals: 'rgb(128, 128, 128)', msg: 'the note is grey' },
        { kind: 'styleNot', sel: 'p:not(.note)', prop: 'color', equals: 'rgb(128, 128, 128)', msg: 'the other paragraph is untouched' }
      ],
      hints: ['Selecting by tag name would catch both paragraphs.',
              'A class selector starts with a dot, and the class is already on the element.'],
      solution: { html: '<p class="note">A note.</p>\n<p>An ordinary paragraph.</p>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.note { color: rgb(128, 128, 128); }' } },

    { id: 'css-3', prompt: 'The heading should be blue, rgb(0, 0, 255), but something is overriding it. Fix it without deleting either rule.',
      scaffold: { html: '<h1 id="title" class="blue">Title</h1>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n#title { color: rgb(0, 0, 0); }\n.blue { color: rgb(0, 0, 255); }' },
      checks: [{ kind: 'style', sel: 'h1', prop: 'color', equals: 'rgb(0, 0, 255)', msg: 'the heading is blue' }],
      hints: ['Both rules match the same element. Which one wins, and why?',
              'An id selector outranks a class no matter which is written later.',
              'Change the colour on the id rule, since that is the rule actually in charge.'],
      solution: { html: '<h1 id="title" class="blue">Title</h1>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n#title { color: rgb(0, 0, 255); }\n.blue { color: rgb(0, 0, 255); }' } }
  ]
},

{
  id: 'css-box',
  title: 'The box model',
  idea: 'Every element is a rectangle with padding, a border and margin.',
  teach: [
    { h: 'Four layers, outward',
      p: 'The content sits in the middle. Padding is space inside the border, the border is the edge itself, and margin is space outside it pushing other elements away.' },
    { h: 'Padding is inside, margin is outside',
      p: 'Give an element a background colour and the padding is coloured too; the margin never is. That is the quickest way to tell which one you actually wanted.' },
    { h: 'Width can mean two things',
      p: 'By default width sets the content only, so padding and border are added on top and the box comes out wider than you asked. Setting box-sizing: border-box makes width mean the whole visible box, which is what almost everyone expects.' },
    { h: 'Margins between elements collapse',
      p: 'Two stacked elements with 20px margins end up 20px apart, not 40. It surprises everyone once and then never again.' }
  ],
  demo: {
    html: '<div class="card">A card</div>\n<div class="card">Another card</div>',
    css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.card { box-sizing: border-box; width: 200px; padding: 16px; border: 2px solid rgb(46, 139, 114); margin-bottom: 12px; background: rgb(239, 243, 242); }'
  },
  practice: { h: 'Set box-sizing once, at the top',
    p: 'Almost every real stylesheet begins by setting box-sizing: border-box for everything, precisely so that width means what it looks like it means.' },
  tasks: [
    { id: 'box-1', prompt: 'Give the card 20px of padding on all sides and a visible border.',
      scaffold: { html: '<div class="card">A card</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.card { background: rgb(239, 243, 242); }\n' },
      checks: [
        { kind: 'style', sel: '.card', prop: 'paddingTop', equals: '20px', msg: 'padding on top' },
        { kind: 'style', sel: '.card', prop: 'paddingLeft', equals: '20px', msg: 'padding on the left' },
        { kind: 'styleNot', sel: '.card', prop: 'borderTopStyle', equals: 'none', msg: 'a border that is actually drawn' }
      ],
      hints: ['One padding value applies to all four sides at once.',
              'A border needs a width, a style and a colour: 2px solid black.'],
      solution: { html: '<div class="card">A card</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.card { background: rgb(239, 243, 242); padding: 20px; border: 2px solid rgb(46, 139, 114); }' } },

    { id: 'box-2', prompt: 'This card should be exactly 200px wide including its padding and border. It is currently wider. Fix it without changing the width value.',
      scaffold: { html: '<div class="card">A card</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.card { width: 200px; padding: 20px; border: 5px solid rgb(46, 139, 114); background: rgb(239, 243, 242); }' },
      checks: [
        { kind: 'style', sel: '.card', prop: 'boxSizing', equals: 'border-box', msg: 'width counts the whole box' },
        { kind: 'outerWidth', sel: '.card', px: 200, msg: 'the card really measures 200px on screen' }
      ],
      hints: ['By default the padding and border are added outside the width you set.',
              'One property changes what width counts. It is box-sizing.'],
      solution: { html: '<div class="card">A card</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.card { box-sizing: border-box; width: 200px; padding: 20px; border: 5px solid rgb(46, 139, 114); background: rgb(239, 243, 242); }' } }
  ]
},

{
  id: 'css-flex',
  title: 'Putting things in a row',
  idea: 'Flexbox arranges children along a line.',
  teach: [
    { h: 'Boxes stack by default',
      p: 'A div fills the width available and the next one goes underneath. That is block layout, and it is the right default for text.' },
    { h: 'display: flex changes the parent',
      p: 'You set it on the container, not on the things being arranged. Its direct children immediately line up in a row.' },
    { h: 'Two axes, two properties',
      p: 'justify-content spreads the children along the row, and align-items positions them across it. Swapping flex-direction to column swaps which is which, which is the part everyone has to look up twice.' },
    { h: 'gap is the modern way to space them',
      p: 'gap: 12px puts space between the children without adding a margin to the last one. Before it existed this needed fiddly rules, and a lot of old advice still shows those.' }
  ],
  demo: {
    html: '<div class="row">\n  <div class="box">One</div>\n  <div class="box">Two</div>\n  <div class="box">Three</div>\n</div>',
    css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.row { display: flex; gap: 12px; }\n.box { padding: 12px; background: rgb(239, 243, 242); border: 1px solid rgb(46, 139, 114); }'
  },
  practice: { h: 'Style the container, not each child',
    p: 'If you find yourself setting the same margin on every child to line them up, the parent wanted to be a flex container instead. One rule replaces many.' },
  tasks: [
    { id: 'flex-1', prompt: 'These three boxes are stacked. Put them in a row with 10px between them.',
      scaffold: { html: '<div class="row">\n  <div class="box">One</div>\n  <div class="box">Two</div>\n  <div class="box">Three</div>\n</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.row { }\n.box { padding: 12px; background: rgb(239, 243, 242); border: 1px solid rgb(46, 139, 114); }' },
      checks: [
        { kind: 'style', sel: '.row', prop: 'display', equals: 'flex', msg: 'the container is a flex container' },
        { kind: 'style', sel: '.row', prop: 'gap', equals: '10px', msg: 'ten pixels between them' },
        { kind: 'sideBySide', sel: '.box', msg: 'the boxes really are in a row' }
      ],
      hints: ['The change goes on the container, the element that holds the three boxes.',
              'Two declarations: one to make it a flex container, one for the space between.'],
      solution: { html: '<div class="row">\n  <div class="box">One</div>\n  <div class="box">Two</div>\n  <div class="box">Three</div>\n</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.row { display: flex; gap: 10px; }\n.box { padding: 12px; background: rgb(239, 243, 242); border: 1px solid rgb(46, 139, 114); }' } },

    { id: 'flex-2', prompt: 'Push the two items to opposite ends of the bar, and centre them vertically.',
      scaffold: { html: '<div class="bar">\n  <div class="item">Left</div>\n  <div class="item">Right</div>\n</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.bar { display: flex; height: 60px; background: rgb(239, 243, 242); }\n.item { padding: 8px; background: white; }' },
      checks: [
        { kind: 'style', sel: '.bar', prop: 'justifyContent', equals: 'space-between', msg: 'spread to the ends' },
        { kind: 'style', sel: '.bar', prop: 'alignItems', equals: 'center', msg: 'centred across the bar' },
        { kind: 'sideBySide', sel: '.item', msg: 'still a row' }
      ],
      hints: ['One property spreads them along the row, another positions them across it.',
              'The value that pushes the first and last to the edges is space-between.'],
      solution: { html: '<div class="bar">\n  <div class="item">Left</div>\n  <div class="item">Right</div>\n</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.bar { display: flex; justify-content: space-between; align-items: center; height: 60px; background: rgb(239, 243, 242); }\n.item { padding: 8px; background: white; }' } }
  ]
},

{
  id: 'css-responsive',
  title: 'Fitting any screen',
  idea: 'The same page, readable on a phone and on a desktop.',
  teach: [
    { h: 'Start narrow',
      p: 'Write the phone layout as the plain rules, then add what changes on bigger screens. Going the other way means overriding yourself constantly.' },
    { h: 'A media query is a conditional block',
      p: '@media (min-width: 600px) { ... } applies its rules only when the viewport is at least that wide. It is the closest thing CSS has to an if statement.' },
    { h: 'Prefer flexible sizes',
      p: 'A width of 100% or max-width: 600px adapts on its own. A fixed 800px will overflow a phone no matter how many media queries you add afterwards.' },
    { h: 'Wrapping is often enough',
      p: 'flex-wrap: wrap lets a row become several rows when it runs out of space, with no query at all. Reach for that before writing breakpoints.' }
  ],
  demo: {
    html: '<div class="wrap">\n  <div class="cell">One</div>\n  <div class="cell">Two</div>\n  <div class="cell">Three</div>\n</div>',
    css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.wrap { display: flex; flex-wrap: wrap; gap: 8px; }\n.cell { flex: 1 1 120px; padding: 12px; background: rgb(239, 243, 242); }'
  },
  practice: { h: 'Resize before you add a breakpoint',
    p: 'Most layouts that seem to need a media query only need wrapping or a max-width. Every breakpoint you add is another state you have to keep correct forever.' },
  tasks: [
    { id: 'resp-1', prompt: 'Let this row wrap onto more lines when it runs out of space, and keep the page content no wider than 600px.',
      scaffold: { html: '<div class="wrap">\n  <div class="cell">One</div>\n  <div class="cell">Two</div>\n  <div class="cell">Three</div>\n</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.wrap { display: flex; gap: 8px; }\n.cell { padding: 12px; background: rgb(239, 243, 242); }' },
      checks: [
        { kind: 'style', sel: '.wrap', prop: 'flexWrap', equals: 'wrap', msg: 'the row may wrap' },
        { kind: 'style', sel: '.wrap', prop: 'maxWidth', equals: '600px', msg: 'it stops growing past 600px' }
      ],
      hints: ['One property lets a flex row break onto another line.',
              'max-width sets a ceiling without forcing a fixed size.'],
      solution: { html: '<div class="wrap">\n  <div class="cell">One</div>\n  <div class="cell">Two</div>\n  <div class="cell">Three</div>\n</div>', css: 'body { font-family: system-ui, sans-serif; padding: 12px; }\n.wrap { display: flex; flex-wrap: wrap; gap: 8px; max-width: 600px; }\n.cell { padding: 12px; background: rgb(239, 243, 242); }' } }
  ]
}
];
/* MARKUP-END */

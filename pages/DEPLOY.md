# Putting Step Through on the web

The app is one file. This folder is the copy that gets served.

## Build it

    python3 build.py        # -> polyglot.html  (self-contained, works from a file)
    python3 make-pages.py   # -> pages/index.html (manifest + service worker)
    node pages-check.mjs    # proves the result over http, including offline

`pages/index.html` differs from `polyglot.html` in exactly two ways, both of
which need a real origin: the inline `data:` manifest becomes `manifest.json`,
and a service worker is registered. Nothing else changes: do not edit either
file by hand.

## Deploy on GitHub Pages

1. Push the contents of this `pages/` folder to the repo you want to serve , 
   either the root of a `gh-pages` branch, or a `/docs` folder on `main`.
2. Settings -> Pages -> Source: pick that branch and folder.
3. Wait for the green check, then open the URL on a phone.

Files that must ship together: `index.html`, `manifest.json`, `sw.js`,
`icons/icon-192.png`, `icons/icon-512.png`.

## Installing it on a phone

- **iOS/Safari**: Share -> Add to Home Screen. It opens full-screen with no
  browser chrome.
- **Android/Chrome**: an install prompt appears, or menu -> Install app.

Once installed it works with no signal: the service worker serves the app from
cache and only reaches the network to pick up a newer copy.

## Shipping an update

Bump `CACHE` in `sw.js` (`polyglot-v1` -> `polyglot-v2`) whenever you deploy a
new `index.html`. Without that bump, people who already installed it keep
getting the old cached copy. The old cache is deleted on activate.

## Where progress lives

`localStorage`, under `polyglot:v2`, on the device. It is not synced anywhere
and there is no account. Inside a Claude artifact the same build uses
`window.storage` instead, because localStorage is blocked there: the app picks
whichever exists, so one build serves both.

# Publishing Step Through

Every file is in one folder. GitHub Pages serves `index.html` as the website.

## Uploading from an iPhone

1. In the Files app, tap the zip. It unpacks into a folder called `step-through`.
2. In Safari, open your repository on github.com. Tap "Add file", then "Upload files", then "choose your files".
3. Tap "Browse", open the `step-through` folder, tap "Select", select every file, then tap "Open".
4. Scroll down and tap "Commit changes".

GitHub accepts up to 100 files per upload, and this folder has fewer than 40. Uploading a file with the same name as one already there replaces it.

`.gitignore` starts with a dot, so the Files app may hide it. You do not need it for uploading this way. It only matters if you later use git on a computer.

## Turning the website on (once)

1. Open the repository's Settings, then Pages.
2. Under "Build and deployment", choose "Deploy from a branch".
3. Choose your main branch and "/ (root)", then Save.
4. Wait a minute or two. The site appears at `https://<your-username>.github.io/<repository-name>/`.

## Shipping an update

    npm run build           # rebuilds polyglot.html and index.html
    npm run test:browser    # includes pages-check, which serves this folder over http and tests it offline

Before you upload, raise the version at the top of `sw.js` (for example `polyglot-v2` to `polyglot-v3`). The app is cached so it works with no signal, which means people who already installed it keep the old copy until that version changes.

Never edit `index.html` by hand. It is generated from the source files.

## Installing it on a phone

- **iPhone (Safari):** tap Share, then "Add to Home Screen". It opens full screen, like an app.
- **Android (Chrome):** accept the install prompt, or open the menu and choose "Install app".

Once installed it works offline.

## Changing the icon

Replace `icon-source.png` with a 1024 by 1024 square that is the icon's own colour right to the edges, with no rounded corners and no shadow. Phones round the corners themselves. Then run `python3 make-icons.py`, raise the version in `sw.js`, and upload the four icon files, `icon-source.png` and `sw.js`.

A phone keeps the icon and name it had when the app was added to the home screen. To see a new icon or name, remove the app from the home screen and add it again from Safari.

## Where progress lives

In the browser on that device, under `polyglot:v2`. There is no account and nothing is sent anywhere. The key keeps its old name on purpose so the rename did not reset anyone's progress.

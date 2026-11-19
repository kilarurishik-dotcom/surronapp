# My LBX — offline iPhone app

A standalone version of the Sur-Ron Light Bee X logbook. No accounts, no AI, no internet needed after the first load. All data stays on the phone (IndexedDB, mirrored to localStorage).

## Files (all in one folder — upload every one to the repository root, next to index.html)

index.html · sw.js · manifest.webmanifest · hero.png · side.jpg · promo.jpg · icon-192.png · icon-512.png · icon-maskable-512.png · apple-touch-icon.png

GitHub Pages is case-sensitive: `hero.png` and `Hero.PNG` are different files. Names must match exactly.

## Put it on GitHub Pages (no terminal needed)

1. On github.com, open your repository → **Add file → Upload files**, drag in all the files above, and commit (overwrite the old ones).
2. **Settings → Pages**: Source **Deploy from a branch**, branch **main**, folder **/ (root)**.
3. Your app is at `https://YOUR-USERNAME.github.io/REPO-NAME/`.

## Install on iPhone

1. Open the link in **Safari** → **Share → Add to Home Screen**.
2. Open it once from the home screen while online so it caches. After that it works offline.

## Updating the app later

Change the files, then bump `VERSION` in `sw.js` (e.g. `v1.0.1` → `v1.0.2`) and upload again. The phone picks up the new version the next time the app is opened online, and it takes effect the launch after that.

## Your data

- Stored only on this phone, inside the home-screen app. A regular Safari tab has a **separate** copy.
- Deleting the home-screen app deletes its data. Use **Settings → Save backup file** now and then.

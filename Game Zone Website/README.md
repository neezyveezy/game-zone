# 🎮 Game Zone

My games, playable in the browser. Open Game Zone, pick a game, play.

---

## Part 1: Put it online (one time, about 10 minutes)

### 1. Make a GitHub account
Go to **https://github.com** and sign up (free).
Your username becomes part of the link, so choose one you like.

### 2. Create the repository (the online folder)
1. Click the **+** at the top right → **New repository**.
2. **Repository name:** `game-zone`
3. Choose **Public** (free websites need a public repository).
4. Tick **Add a README file**.
5. Click **Create repository**.

### 3. Upload everything
1. On your new repository page, click **Add file → Upload files**.
2. Open this folder (**Game Zone Website**) on your computer.
3. Press **Ctrl + A** to select everything, then drag it all into the browser window.
4. Wait until every file shows in the list, scroll down, click **Commit changes**.

### 4. Turn on the website
1. In the repository, click **Settings** (top menu) → **Pages** (left menu).
2. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.
3. Wait 1–2 minutes, refresh the page. At the top it shows:
   **Your site is live at `https://YOUR-USERNAME.github.io/game-zone/`**

### 5. Send the link to your friends
That link opens Game Zone. Everything else is reachable from there.
Tip: friends on a phone can use **Share → Add to Home Screen** to get it like an app.

---

## Part 2: Updating things later

> ⚠️ **Always upload the file with the exact same name.** GitHub treats a file
> with the same name as the new version and replaces the old one.
> Capital letters matter: `SkyVault.html` and `skyvault.html` are different files online.

### Update a game
1. Change the game on your computer (in this folder).
2. On GitHub, open your repository → **Add file → Upload files**.
3. Drag in the changed game file (for example `midnight-velvet.html`) → **Commit changes**.
4. Live for everyone within about 1–2 minutes.

### Update the Game Zone page
The Game Zone page is the file **`index.html`**. It has to keep that name online,
so if you ever have it as `Game Zone.html`, rename it to `index.html` before uploading.
Then upload it the same way as a game.

### Add a brand-new game
1. Upload the new game's `.html` file.
2. Add it to the game list in `index.html` (search for `const GAMES` near the
   bottom. There's an example line showing how) and upload `index.html` again.
   Or just ask Claude to add the card for you.

### Post an announcement (the "New update" badge and pop-up)
You can do this right on the GitHub website, no uploading needed:
1. In your repository, click **`news.js`** → click the ✏️ pencil (top right of the file).
2. Copy one of the `{ ... },` blocks, paste it at the top of the list, and change
   the game file name, date (`YYYY-MM-DD`) and text.
3. Click **Commit changes**. Your friends see the badge and pop-up next time they open Game Zone.

### Friends still see the old version?
GitHub can keep the old version for up to about 10 minutes. After that, tell them
to refresh with **Ctrl + F5** (computer) or pull down to refresh (phone).

---

## Good to know
- **Saves are per person, per device.** Each friend's progress is stored in their own
  browser. Playing on a phone and a laptop means two separate saves.
- **Seasonal events** (Halloween, Christmas, New Year, Easter...) switch on and off
  by themselves based on the date. Nothing to upload.
- **Admin passwords** are stored scrambled in the game code, so they can't be read
  from it. Tell them only to people you trust.
- **Free limits:** GitHub Pages easily handles 20 friends (the limit is roughly
  100 GB of downloads per month; this whole site is about 3 MB).
- **Public** means anyone who has or finds the link can play. Only people you send
  the link to will realistically find it.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | **Game Zone**, the main page your link opens |
| `burnout-skies.html`, `hangar-workshop.html`, `iron-atoll.html`, `Iron-Mandate.html`, `midnight-velvet.html`, `pixel-front.html`, `SkyVault.html`, `tumble-lab.html` | The games |
| `news.js` | Announcements shown in Game Zone |
| `.nojekyll` | Tells GitHub to publish the files as they are (leave it in) |
| `README.md` | This guide (shows on your repository's page on GitHub) |

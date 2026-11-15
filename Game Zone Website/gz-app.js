/* Game Zone as an app.
   - In a normal browser tab: a screen you can't close that says Game Zone is an app now, with a download button.
   - In the installed app: games open inside the same window (one app for every game), with a 🏠 button to go back. */
(function () {
  'use strict';
  const mq = (m) => matchMedia('(display-mode: ' + m + ')').matches;
  const APP = mq('standalone') || mq('fullscreen') || mq('minimal-ui') || mq('window-controls-overlay') || navigator.standalone === true;
  const local = location.protocol === 'file:';

  // The hub was loaded inside the game player (a game sent you "home"): just close the player.
  if (window.top !== window) {
    try { if (window.top.GZ_PLAYER) { window.top.GZ_PLAYER.close(); return; } } catch (e) { /* not our page */ }
  }

  window.GZ_APP = APP;
  document.documentElement.classList.add(APP ? 'gz-app' : 'gz-web');

  // keeps the Game Zone page on the computer so the app opens fast (After Hours keeps its own files)
  if ('serviceWorker' in navigator && !local) navigator.serviceWorker.register('./gz-sw.js', { scope: './' }).catch(() => {});

  const css = document.createElement('style');
  css.textContent = `
html.gz-gate, html.gz-gate body { overflow: hidden !important; }
html.gz-gate body > *:not(#gz-gate), html.gz-playing body > *:not(#gz-play) { display: none !important; }
#gz-gate { position: fixed; inset: 0; z-index: 2147483600; display: flex; align-items: center; justify-content: center; padding: 18px; overflow: auto;
  background: radial-gradient(ellipse at 50% 20%, #2d1166 0%, #0b0618 60%, #05030b 100%); color: #f3efff; font: 16px/1.5 "Nunito", system-ui, sans-serif; text-align: center; }
#gz-gate::before { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5;
  background-image: radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 70% 60%, #fff, transparent), radial-gradient(1.5px 1.5px at 40% 80%, #c9b8ff, transparent),
    radial-gradient(1px 1px at 85% 20%, #fff, transparent), radial-gradient(1.5px 1.5px at 10% 70%, #ffb3d1, transparent), radial-gradient(1px 1px at 55% 15%, #fff, transparent); }
#gz-gate .box { position: relative; max-width: 520px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px; }
#gz-gate img { width: 120px; height: 120px; border-radius: 28px; box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 18px 50px rgba(139,92,255,.45); animation: gzfloat 3.5s ease-in-out infinite; }
@keyframes gzfloat { 50% { transform: translateY(-8px) rotate(-2deg); } }
#gz-gate .kick { font: 800 12px "Nunito", sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #22e4ff; }
#gz-gate h1 { margin: 0; font: 700 clamp(28px, 6vw, 40px)/1.1 "Fredoka", "Nunito", sans-serif;
  background: linear-gradient(90deg, #22e4ff, #8b5cff 55%, #ff3d81); -webkit-background-clip: text; background-clip: text; color: transparent; }
#gz-gate p { margin: 0; color: #c8bfe6; }
#gz-gate .perks { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 2px 0; }
#gz-gate .perks span { padding: 5px 11px; border-radius: 999px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); font-size: 13px; font-weight: 700; }
#gz-gate button.go { font: 700 19px "Fredoka", "Nunito", sans-serif; padding: 15px 34px; border: 0; border-radius: 16px; cursor: pointer; color: #fff; min-width: 280px;
  background: linear-gradient(90deg, #22e4ff, #8b5cff 50%, #ff3d81); box-shadow: 0 10px 30px rgba(139,92,255,.45), 0 4px 0 #4a2a9a; transition: transform .1s; }
#gz-gate button.go:hover { transform: translateY(-2px); } #gz-gate button.go:active { transform: translateY(1px); }
#gz-gate ol { text-align: left; margin: 0; padding: 12px 16px 12px 36px; border-radius: 14px; background: rgba(255,255,255,.06); display: flex; flex-direction: column; gap: 6px; }
#gz-gate small { color: #8f86b0; font-size: 13px; }
#gz-gate a { color: #9fd8ff; }
#gz-gate .ok { padding: 12px 16px; border-radius: 14px; background: rgba(47,191,113,.15); box-shadow: inset 0 0 0 1px rgba(47,191,113,.45); color: #c9f7dc; font-weight: 700; }
#gz-play { position: fixed; inset: 0; z-index: 2147483500; background: #000; }
#gz-play iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; display: block; background: #000; }
#gz-home { position: absolute; left: 50%; top: 6px; transform: translate(-50%, -70%); z-index: 2; border: 0; cursor: pointer; padding: 6px 14px 5px; border-radius: 0 0 12px 12px;
  background: rgba(16,10,36,.82); color: #fff; font: 700 13px "Nunito", system-ui, sans-serif; box-shadow: 0 4px 16px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.14);
  opacity: .55; transition: transform .2s, opacity .2s; }
#gz-home:hover, #gz-home:focus-visible, #gz-play.peek #gz-home { transform: translate(-50%, -6px); opacity: 1; }`;
  document.head.appendChild(css);

  /* ---------------- the browser: "Game Zone is an app now" ---------------- */
  if (!APP && !local) {
    document.documentElement.classList.add('gz-gate');
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const android = /android/i.test(ua), edge = /Edg\//.test(ua), ff = /firefox|fxios/i.test(ua), samsung = /SamsungBrowser/i.test(ua);
    const safari = /safari/i.test(ua) && !/chrome|chromium|crios|edg|fxios|opr/i.test(ua);
    let promptEv = null, mode = 'intro', el = null, haveApp = false;
    addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); promptEv = e; if (mode === 'help') mode = 'intro'; paint(); });
    addEventListener('appinstalled', () => { promptEv = null; mode = 'done'; paint(); });
    // Chrome can tell us when the app is already on this computer
    if (navigator.getInstalledRelatedApps) navigator.getInstalledRelatedApps().then((l) => { if (l && l.length) { haveApp = true; paint(); } }).catch(() => {});

    const steps = () => ios ? (safari ? ['Tap the <b>Share</b> button (the square with the arrow) at the bottom or top of Safari.', 'Scroll down and tap <b>Add to Home Screen</b>.', 'Tap <b>Add</b>. Game Zone is now on your home screen.']
        : ['Open this page in <b>Safari</b> (iPhones and iPads can only add apps from Safari).', 'Tap <b>Share</b>, then <b>Add to Home Screen</b>.'])
      : ff ? (android ? ['Tap the <b>⋮</b> menu of Firefox.', 'Tap <b>Install</b> (or <b>Add to Home screen</b>).']
        : ['Firefox on a computer can\'t install apps.', 'Open this page in <b>Microsoft Edge</b> (it\'s on every Windows PC) or <b>Google Chrome</b> and press the download button there.'])
      : safari ? ['In the menu bar at the top of your screen, click <b>File</b>.', 'Click <b>Add to Dock…</b>, then <b>Add</b>.']
      : android ? [samsung ? 'Tap the <b>☰</b> menu at the bottom.' : 'Tap the <b>⋮</b> menu at the top right.', 'Tap <b>Install app</b> or <b>Add to Home screen</b>.', 'Tap <b>Install</b>.']
      : edge ? ['Click the <b>···</b> button at the top right of Edge.', 'Click <b>Apps</b>, then <b>Install Game Zone</b>.', 'Or click the small <b>app icon</b> at the right end of the address bar.']
      : ['Click the <b>⋮</b> button at the top right of Chrome.', 'Click <b>Cast, save and share</b>, then <b>Install page as app…</b> (or <b>Install Game Zone…</b>).', 'Or click the small <b>install icon</b> at the right end of the address bar.'];

    async function install() {
      if (promptEv) {
        const p = promptEv; promptEv = null; p.prompt();
        let ok = false; try { ok = (await p.userChoice).outcome === 'accepted'; } catch (e) { /* ignore */ }
        mode = ok ? 'done' : 'help'; paint(); return;
      }
      mode = 'help'; paint();
    }
    function paint() {
      if (!el) return;
      const where = ios || android ? 'your home screen' : safari ? 'your Dock' : 'your desktop and Start menu';
      let body;
      if (mode === 'done') body = `<div class="ok">✅ Game Zone is installed! Open it from ${where}. You can close this tab.</div>`;
      else if (mode === 'help') body = `<p>${promptEv || ios || ff || safari ? '' : 'Your browser didn\'t show its download question this time. '}It only takes a few taps:</p><ol>${steps().map((s) => `<li>${s}</li>`).join('')}</ol>${promptEv ? '<button type="button" class="go">📲 Download Game Zone</button>' : ''}`;
      else body = `<button type="button" class="go">📲 Download the Game Zone app</button>`;
      el.innerHTML = `<div class="box">
        <img src="icon-512.png" alt="">
        <div class="kick">Big news</div>
        <h1>Game Zone is an app now!</h1>
        <p>Game Zone has moved on from websites. Every game now lives in <b>one free app</b>: one icon, all the games, and they all open right inside it.</p>
        <div class="perks"><span>🎮 Every game in one place</span><span>⚡ Opens in a second</span><span>🪟 Its own window, no tabs</span><span>🆓 Free, nothing extra to install</span></div>
        ${body}
        ${haveApp && mode !== 'done' ? `<div class="ok">You already have the app! Open Game Zone from ${where}.</div>` : mode !== 'done' ? `<small>Already have it? Open Game Zone from ${where}.</small>` : ''}
        <small><a href="legal.html" target="_blank" rel="noopener">Terms & Privacy</a> · © NeezyVeezy</small></div>`;
      const b = el.querySelector('button.go'); if (b) b.addEventListener('click', install);
    }
    const show = () => {
      el = document.createElement('div'); el.id = 'gz-gate'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Download the Game Zone app');
      document.body.appendChild(el); paint();
      // nothing on the page behind it may take it away
      new MutationObserver(() => { if (!el.isConnected) document.body.appendChild(el); document.documentElement.classList.add('gz-gate'); })
        .observe(document.body, { childList: true });
      new MutationObserver(() => { if (!document.documentElement.classList.contains('gz-gate')) document.documentElement.classList.add('gz-gate'); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    };
    if (document.body) show(); else addEventListener('DOMContentLoaded', show);
    window.GZ_PLAYER = null;
    return;
  }

  /* ---------------- the app: every game plays inside this one window ---------------- */
  let box = null, frame = null, scrollY0 = 0, title0 = document.title, peekT = 0;
  const P = window.GZ_PLAYER = {
    on: APP,
    open(file, name) {
      if (frame) P.close(true);
      scrollY0 = window.scrollY;
      if (!box) {
        box = document.createElement('div'); box.id = 'gz-play';
        box.innerHTML = '<button type="button" id="gz-home" title="Back to Game Zone">🏠 Game Zone</button>';
        box.querySelector('#gz-home').addEventListener('click', () => P.close());
        // show the home button for a moment when the mouse goes near the top of the window
        box.addEventListener('mousemove', (e) => { if (e.clientY < 40) { box.classList.add('peek'); clearTimeout(peekT); peekT = setTimeout(() => box.classList.remove('peek'), 1500); } });
        document.body.appendChild(box);
      }
      frame = document.createElement('iframe');
      frame.allow = 'fullscreen *; autoplay *; gamepad *; clipboard-read *; clipboard-write *; microphone *; camera *; screen-wake-lock *';
      frame.allowFullscreen = true;
      frame.title = name || 'Game';
      frame.src = file;
      box.insertBefore(frame, box.firstChild);
      document.documentElement.classList.add('gz-playing');
      document.title = (name ? name + ' · ' : '') + 'Game Zone';
      history.pushState({ gzPlay: file }, '');
      frame.addEventListener('load', () => { try { frame.contentWindow.focus(); } catch (e) { /* ignore */ } });
      setTimeout(() => { box.classList.add('peek'); peekT = setTimeout(() => box.classList.remove('peek'), 2500); }, 300);
    },
    close(fromHistory) {
      if (!frame) return;
      try { frame.src = 'about:blank'; } catch (e) { /* ignore */ }   // stops the game's sound right away
      frame.remove(); frame = null;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      document.documentElement.classList.remove('gz-playing');
      document.title = title0;
      requestAnimationFrame(() => window.scrollTo(0, scrollY0));
      if (!fromHistory && history.state && history.state.gzPlay) history.back();
      window.dispatchEvent(new Event('gz-closed'));
    },
    get playing() { return !!frame; },
  };
  // the mouse's back button, Alt+← and a game's own "back" all bring you home
  addEventListener('popstate', () => { if (frame) P.close(true); });
})();

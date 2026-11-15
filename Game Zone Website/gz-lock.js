/* Game Zone games only play inside the Game Zone app.
   Opened on its own in a browser tab, a game sends you to Game Zone, which offers the app download. */
(function () {
  if (location.protocol === 'file:') return;
  const mq = (m) => matchMedia('(display-mode: ' + m + ')').matches;
  if (mq('standalone') || mq('fullscreen') || mq('minimal-ui') || mq('window-controls-overlay') || navigator.standalone === true) return;   // the app
  try { if (window.top !== window && window.top.GZ_PLAYER) return; } catch (e) { /* framed by another site */ }   // playing inside the Game Zone app
  document.documentElement.style.visibility = 'hidden';
  location.replace('index.html');
})();

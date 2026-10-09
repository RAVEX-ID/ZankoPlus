/**
 * app.js — page bootstrap. Every page script starts with `Zanko.app.start(...)`.
 *
 *   access: 'private'  signed-in learners only (others go to login.html)
 *           'guest'    visitors only (signed-in learners go to home.html)
 */
(function (Zanko) {
  'use strict';

  const { store, utils, layout } = Zanko;

  Zanko.app = {
    async start({ access }, render) {
      try {
        await store.init();
      } catch (error) {
        document.getElementById('app').innerHTML =
          `<div class="panel empty-state">${utils.escapeHtml(error.message)}</div>`;
        return;
      }

      if (access === 'private' && !store.isAuthenticated) return utils.redirect('login.html');
      if (access === 'guest' && store.isAuthenticated) return utils.redirect('home.html');

      layout.mount();
      render();
    },
  };
})(window.Zanko);

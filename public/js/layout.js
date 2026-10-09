/**
 * layout.js — shared page chrome: animated backdrop, header and footer.
 * Every page calls `Zanko.layout.mount()` once; `refreshHeader()` re-renders the stats.
 */
(function (Zanko) {
  'use strict';

  const { store, config, utils, icon } = Zanko;

  const header = () => document.getElementById('site-header');

  function renderBackdrop() {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<div class="orb orb--1"></div><div class="orb orb--2"></div><div class="orb orb--3"></div>'
    );
  }

  function renderUserChip(user) {
    const initial = utils.escapeHtml([...user.fullName][0]);
    const firstName = utils.escapeHtml(user.fullName.split(' ')[0]);
    const avatarBackground = utils.gradient(utils.hueFromText(user.fullName));
    return `
      <a class="stat user-chip" href="profile.html" title="پرۆفایل">
        <span class="avatar avatar--sm" style="background:${avatarBackground}">${initial}</span>${firstName}
      </a>`;
  }

  function renderLearnerStats() {
    const level = store.level;
    const titles = config.levelTitles;
    const levelTitle = titles[Math.min(level - 1, titles.length - 1)];
    return `
      ${renderUserChip(store.user)}
      <div class="level">
        <small class="level__title">ئاستی ${level} · ${levelTitle}</small>
        <div class="progress"><div class="progress__bar" style="width:${store.levelProgress}%"></div></div>
      </div>
      <div class="stat stat--xp"><span>${icon('star', 17)}</span><span>${store.xp}</span></div>
      <div class="stat stat--streak"><span>${icon('flame', 17)}</span><span>${store.streak}</span></div>
      <button class="icon-btn" data-action="logout" title="چوونەدەرەوە" aria-label="چوونەدەرەوە">${icon('logout', 18)}</button>`;
  }

  function renderHeader() {
    const signedIn = store.isAuthenticated;
    header().innerHTML = `
      <div class="site-header__inner">
        <a class="logo" href="${signedIn ? 'home.html' : 'index.html'}">
          <div class="logo__mark">${icon('cap', 20)}</div>
          <div>زانکۆ<span>پلەس</span></div>
        </a>
        ${signedIn ? renderLearnerStats() : ''}
      </div>`;
  }

  function renderFooter() {
    document.getElementById('site-footer').textContent = 'نموونەی سەرەتایی (Prototype) · زانکۆپلەس';
  }

  function bindLogout() {
    header().addEventListener('click', async (event) => {
      if (!event.target.closest('[data-action="logout"]')) return;
      await store.logout();
      utils.redirect('index.html');
    });
  }

  Zanko.layout = {
    mount() {
      renderBackdrop();
      renderHeader();
      renderFooter();
      bindLogout();
    },
    refreshHeader: renderHeader,
  };
})(window.Zanko);

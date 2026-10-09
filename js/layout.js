/**
 * layout.js — shared page chrome: animated backdrop, header and footer.
 * Every page calls `Zanko.layout.mount()` once; `refreshHeader()` re-renders the stats.
 */
(function (Zanko) {
  'use strict';

  const { store, config, icon } = Zanko;

  function renderBackdrop() {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<div class="orb orb--1"></div><div class="orb orb--2"></div><div class="orb orb--3"></div>'
    );
  }

  function renderGradeBadge() {
    if (!store.grade) return '';
    return `<a class="stat" href="index.html?change=1" title="گۆڕینی پۆل">` +
      `${icon('cap', 17)} ${config.grades[store.grade].name}</a>`;
  }

  function renderHeader() {
    const level = store.level;
    const titles = config.levelTitles;
    const levelTitle = titles[Math.min(level - 1, titles.length - 1)];

    document.getElementById('site-header').innerHTML = `
      <div class="site-header__inner">
        <a class="logo" href="home.html">
          <div class="logo__mark">${icon('cap', 20)}</div>
          <div>زانکۆ<span>پلەس</span></div>
        </a>
        ${renderGradeBadge()}
        <div class="level">
          <small class="level__title">ئاستی ${level} · ${levelTitle}</small>
          <div class="progress"><div class="progress__bar" style="width:${store.levelProgress}%"></div></div>
        </div>
        <div class="stat stat--xp"><span>${icon('star', 17)}</span><span>${store.xp}</span></div>
        <div class="stat stat--streak"><span>${icon('flame', 17)}</span><span>${store.streak}</span></div>
      </div>`;
  }

  function renderFooter() {
    document.getElementById('site-footer').textContent = 'نموونەی سەرەتایی (Prototype) · زانکۆپلەس';
  }

  Zanko.layout = {
    mount() {
      renderBackdrop();
      renderHeader();
      renderFooter();
    },
    refreshHeader: renderHeader,
  };
})(window.Zanko);

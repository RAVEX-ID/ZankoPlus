/**
 * pages/index.js — grade picker (entry page).
 * Returning learners are sent straight to home.html unless they arrived via "change grade".
 */
(function (Zanko) {
  'use strict';

  const { store, config, utils, icon, layout } = Zanko;

  if (store.grade && !utils.queryParam('change')) {
    utils.redirect('home.html');
    return;
  }

  layout.mount();

  const gradeCard = (grade) => `
    <a class="grade-card animated-gradient" href="home.html" data-grade="${grade}"
       style="background:${utils.gradient(config.grades[grade].hue)}">
      ${icon('cap', 130, 1.3)}
      <b>${grade}</b>${config.grades[grade].name}
    </a>`;

  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="welcome">
      <div class="logo__mark animated-gradient">${icon('cap', 38, 1.8)}</div>
      <div class="welcome__title">زانکۆ<span>پلەس</span></div>
      <h1>بەخێربێیت بۆ پلاتفۆرمی فێربوون</h1>
      <p class="text-muted">باشترین مامۆستایان و کۆرسەکان بۆ قوتابیانی هەرێمی کوردستان، لە یەک شوێندا.</p>
      <h2>پۆلەکەت هەڵبژێرە</h2>
      <div class="grade-grid">${Object.keys(config.grades).map(gradeCard).join('')}</div>
    </div>`;

  // The link navigates to home.html; we only need to remember the choice first.
  app.addEventListener('click', (event) => {
    const card = event.target.closest('[data-grade]');
    if (card) store.setGrade(Number(card.dataset.grade));
  });
})(window.Zanko);

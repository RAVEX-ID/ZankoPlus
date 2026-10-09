/**
 * pages/index.js — landing page for visitors.
 */
(function (Zanko) {
  'use strict';

  const { icon } = Zanko;

  const FEATURES = [
    { icon: 'cap', title: 'کۆرسی باشترین مامۆستایان', text: 'هەموو کۆرسەکانی پۆلەکەت لە یەک شوێندا، بە ڕوونکردنەوەی جیاواز.' },
    { icon: 'star', title: 'ئاست و خاڵ', text: 'بە تەواوکردنی هەر وانەیەک خاڵ وەردەگریت و ئاستەکەت بەرز دەبێتەوە.' },
    { icon: 'check', title: 'پێشکەوتنەکەت هەڵدەگیرێت', text: 'لە هەر ئامێرێکەوە بچیتە ژوورەوە، لەو شوێنەوە بەردەوام دەبیت کە وازت لێهێنا.' },
  ];

  const featureCard = ({ icon: name, title, text }) => `
    <div class="panel feature">
      <div class="stat-card__icon">${icon(name, 22)}</div>
      <h3>${title}</h3>
      <p class="text-muted">${text}</p>
    </div>`;

  Zanko.app.start({ access: 'guest' }, () => {
    document.getElementById('app').innerHTML = `
      <div class="welcome">
        <div class="logo__mark animated-gradient">${icon('cap', 38, 1.8)}</div>
        <div class="welcome__title">زانکۆ<span>پلەس</span></div>
        <h1>پلاتفۆرمی فێربوون بۆ پۆلی ١٠ و ١١ و ١٢</h1>
        <p class="text-muted">باشترین مامۆستایان و کۆرسەکان بۆ قوتابیانی هەرێمی کوردستان، لە یەک شوێندا.</p>
        <div class="actions actions--center">
          <a class="btn" href="register.html">دروستکردنی ئەکاونت</a>
          <a class="btn btn--outline" href="login.html">چوونەژوورەوە</a>
        </div>
        <div class="feature-grid">${FEATURES.map(featureCard).join('')}</div>
      </div>`;
  });
})(window.Zanko);

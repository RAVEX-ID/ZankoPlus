/**
 * pages/profile.js — personal info, progress overview, password and account management.
 */
(function (Zanko) {
  'use strict';

  const { store, config, catalog, components, forms, utils, layout, icon } = Zanko;
  const esc = utils.escapeHtml;

  function statCard(iconName, value, label) {
    return `
      <div class="panel stat-card">
        <div class="stat-card__icon">${icon(iconName, 22)}</div>
        <div><b>${value}</b><small>${label}</small></div>
      </div>`;
  }

  function progressRows() {
    const started = catalog.coursesByGrade(store.grade).filter((course) => store.progressPercent(course) > 0);
    if (!started.length) {
      return `<p class="text-muted">هێشتا هیچ وانەیەکت تەواو نەکردووە. <a class="link" href="home.html">دەست پێبکە</a></p>`;
    }
    return started.map((course) => {
      const percent = store.progressPercent(course);
      return `
        <a class="progress-row" href="${components.courseUrl(course.id)}">
          <div class="meta"><b>${course.title}</b><span>${percent}%</span></div>
          <div class="progress"><div class="progress__bar" style="width:${percent}%"></div></div>
        </a>`;
    }).join('');
  }

  function header(user) {
    const chips = [config.grades[user.grade].name, user.city, user.school]
      .filter(Boolean).map((text) => `<span class="chip">${esc(text)}</span>`).join('');
    return `
      <div class="panel profile-head">
        <div class="avatar" style="background:${utils.gradient(utils.hueFromText(user.fullName))}">${esc([...user.fullName][0])}</div>
        <div>
          <h1>${esc(user.fullName)}</h1>
          <div class="text-muted">${esc(user.email)}</div>
          <div class="chips">${chips}</div>
        </div>
      </div>`;
  }

  function infoForm(user) {
    return `
      <form class="form" id="info-form" novalidate>
        ${forms.field({ name: 'fullName', label: 'ناوی تەواو', value: user.fullName, autocomplete: 'name', required: true })}
        ${forms.gradeChoice(user.grade)}
        <div class="form-row">
          ${forms.citySelect(user.city || '')}
          ${forms.field({ name: 'phone', label: 'ژمارەی مۆبایل', type: 'tel', value: user.phone || '', autocomplete: 'tel' })}
        </div>
        ${forms.field({ name: 'school', label: 'ناوی قوتابخانە', value: user.school || '' })}
        ${forms.messageBox()}
        <button class="btn" type="submit">هەڵگرتنی گۆڕانکاری</button>
      </form>`;
  }

  const passwordForm = () => `
    <form class="form" id="password-form" novalidate>
      ${forms.field({ name: 'currentPassword', label: 'وشەی نهێنی ئێستا', type: 'password', autocomplete: 'current-password', required: true })}
      ${forms.field({ name: 'newPassword', label: 'وشەی نهێنی نوێ', type: 'password', autocomplete: 'new-password', required: true })}
      ${forms.messageBox()}
      <button class="btn" type="submit">گۆڕینی وشەی نهێنی</button>
    </form>`;

  const deleteForm = () => `
    <form class="form" id="delete-form" novalidate>
      <p class="text-muted">ئەکاونتەکەت و هەموو پێشکەوتنەکانت بۆ هەمیشە دەسڕدرێنەوە.</p>
      ${forms.field({ name: 'password', label: 'وشەی نهێنی', type: 'password', autocomplete: 'current-password', required: true })}
      ${forms.messageBox()}
      <button class="btn btn--danger" type="submit">سڕینەوەی ئەکاونت</button>
    </form>`;

  function render() {
    const user = store.user;
    const level = store.level;
    document.getElementById('app').innerHTML = `
      ${components.crumbs([{ label: 'پرۆفایل' }])}
      ${header(user)}
      <div class="stats-grid">
        ${statCard('star', store.xp, 'خاڵ')}
        ${statCard('trophy', level, 'ئاست')}
        ${statCard('flame', store.streak, 'ڕۆژی بەردەوام')}
        ${statCard('check', store.completedTotal, 'وانەی تەواوکراو')}
      </div>
      <div class="profile-grid">
        <section class="panel"><h2>پێشکەوتنی کۆرسەکانم</h2>${progressRows()}</section>
        <section class="panel"><h2>زانیاری کەسی</h2>${infoForm(user)}</section>
        <section class="panel"><h2>گۆڕینی وشەی نهێنی</h2>${passwordForm()}</section>
        <section class="panel"><h2>سڕینەوەی ئەکاونت</h2>${deleteForm()}</section>
      </div>`;

    bindForms();
  }

  function bindForms() {
    const infoFormEl = document.getElementById('info-form');
    forms.bind(infoFormEl, async (values) => {
      await store.updateProfile(values);
      layout.refreshHeader();
      render();
      forms.setMessage(document.getElementById('info-form'), 'گۆڕانکارییەکان هەڵگیران', 'success');
    });

    const passwordFormEl = document.getElementById('password-form');
    forms.bind(passwordFormEl, async (values) => {
      await store.changePassword(values);
      passwordFormEl.reset();
      forms.setMessage(passwordFormEl, 'وشەی نهێنی گۆڕدرا', 'success');
    });

    forms.bind(document.getElementById('delete-form'), async ({ password }) => {
      if (!window.confirm('دڵنیایت لە سڕینەوەی ئەکاونتەکەت؟ ناتوانرێت پاشگەز ببیتەوە.')) return;
      await store.deleteAccount(password);
      utils.redirect('index.html');
    });
  }

  Zanko.app.start({ access: 'private' }, render);
})(window.Zanko);

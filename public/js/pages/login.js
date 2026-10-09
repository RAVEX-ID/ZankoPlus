/**
 * pages/login.js — sign-in form.
 */
(function (Zanko) {
  'use strict';

  const { store, forms, utils } = Zanko;

  Zanko.app.start({ access: 'guest' }, () => {
    document.getElementById('app').innerHTML = `
      <section class="panel auth">
        <h1>چوونەژوورەوە</h1>
        <p class="text-muted">بەخێربێیتەوە! بچۆ ژوورەوە بۆ بەردەوامبوون لە فێربوون.</p>
        <form class="form" novalidate>
          ${forms.field({ name: 'email', label: 'ئیمەیڵ', type: 'email', autocomplete: 'email', required: true })}
          ${forms.field({ name: 'password', label: 'وشەی نهێنی', type: 'password', autocomplete: 'current-password', required: true })}
          ${forms.messageBox()}
          <button class="btn btn--block" type="submit">چوونەژوورەوە</button>
        </form>
        <p class="auth__switch">ئەکاونتت نییە؟ <a href="register.html">دروستکردنی ئەکاونت</a></p>
      </section>`;

    forms.bind(document.querySelector('form'), async (values) => {
      await store.login(values);
      utils.redirect('home.html');
    });
  });
})(window.Zanko);

/**
 * pages/register.js — account creation form (personal info + grade).
 */
(function (Zanko) {
  'use strict';

  const { store, forms, utils } = Zanko;

  Zanko.app.start({ access: 'guest' }, () => {
    document.getElementById('app').innerHTML = `
      <section class="panel auth">
        <h1>دروستکردنی ئەکاونت</h1>
        <p class="text-muted">زانیارییەکانت بنووسە بۆ ئەوەی پێشکەوتنەکەت هەڵبگیرێت.</p>
        <form class="form" novalidate>
          ${forms.field({ name: 'fullName', label: 'ناوی تەواو', autocomplete: 'name', required: true })}
          ${forms.field({ name: 'email', label: 'ئیمەیڵ', type: 'email', autocomplete: 'email', required: true })}
          ${forms.gradeChoice()}
          <div class="form-row">
            ${forms.citySelect()}
            ${forms.field({ name: 'phone', label: 'ژمارەی مۆبایل', type: 'tel', autocomplete: 'tel', hint: '(ئارەزوومەندانە)' })}
          </div>
          ${forms.field({ name: 'school', label: 'ناوی قوتابخانە', hint: '(ئارەزوومەندانە)' })}
          ${forms.field({ name: 'password', label: 'وشەی نهێنی', type: 'password', autocomplete: 'new-password', required: true, hint: '(٨ نووسە یان زیاتر، پیت و ژمارە)' })}
          ${forms.field({ name: 'confirmPassword', label: 'دووبارەکردنەوەی وشەی نهێنی', type: 'password', autocomplete: 'new-password', required: true })}
          ${forms.messageBox()}
          <button class="btn btn--block" type="submit">دروستکردنی ئەکاونت</button>
        </form>
        <p class="auth__switch">پێشتر ئەکاونتت هەیە؟ <a href="login.html">چوونەژوورەوە</a></p>
      </section>`;

    const form = document.querySelector('form');
    forms.bind(form, async ({ confirmPassword, ...values }) => {
      if (values.password !== confirmPassword) {
        forms.showFieldError(form, 'confirmPassword', 'وشە نهێنییەکان یەک ناگرنەوە');
        return;
      }
      await store.register(values);
      utils.redirect('home.html');
    });
  });
})(window.Zanko);

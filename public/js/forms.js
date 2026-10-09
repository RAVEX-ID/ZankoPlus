/**
 * forms.js — form field builders and submit handling shared by the account pages.
 * Field markup: <div class="field" data-field="name">…<small class="field__error"></small></div>
 */
(function (Zanko) {
  'use strict';

  const { config, utils } = Zanko;
  const esc = utils.escapeHtml;

  function field({ name, label, type = 'text', value = '', autocomplete = 'off', required = false, hint = '' }) {
    return `
      <div class="field" data-field="${name}">
        <label class="field__label" for="f-${name}">${label}${hint ? ` <span class="field__hint">${hint}</span>` : ''}</label>
        <input class="input" id="f-${name}" name="${name}" type="${type}" value="${esc(value)}"
               autocomplete="${autocomplete}" ${required ? 'required' : ''}>
        <small class="field__error"></small>
      </div>`;
  }

  function citySelect(selected = '') {
    const options = config.cities
      .map((city) => `<option value="${city}" ${city === selected ? 'selected' : ''}>${city}</option>`)
      .join('');
    return `
      <div class="field" data-field="city">
        <label class="field__label" for="f-city">شار / پارێزگا <span class="field__hint">(ئارەزوومەندانە)</span></label>
        <select class="input" id="f-city" name="city"><option value="">—</option>${options}</select>
        <small class="field__error"></small>
      </div>`;
  }

  function gradeChoice(selected = 0) {
    const cards = Object.entries(config.grades).map(([grade, { name }]) => `
      <label>
        <input type="radio" name="grade" value="${grade}" ${Number(grade) === selected ? 'checked' : ''}>
        <span class="grade-choice__box"><b>${grade}</b><small>${name}</small></span>
      </label>`).join('');
    return `
      <div class="field" data-field="grade">
        <span class="field__label">پۆلەکەت</span>
        <div class="grade-choice">${cards}</div>
        <small class="field__error"></small>
      </div>`;
  }

  const messageBox = () => '<p class="form-message" role="alert"></p>';

  const values = (form) => Object.fromEntries(new FormData(form).entries());

  function clear(form) {
    form.querySelectorAll('.field--invalid').forEach((el) => el.classList.remove('field--invalid'));
    form.querySelectorAll('.field__error').forEach((el) => { el.textContent = ''; });
    setMessage(form, '');
  }

  function setMessage(form, text, type = 'error') {
    const box = form.querySelector('.form-message');
    box.textContent = text;
    box.className = `form-message${text ? ` form-message--${type}` : ''}`;
  }

  function showFieldError(form, name, message) {
    const wrapper = form.querySelector(`[data-field="${name}"]`);
    if (!wrapper) return false;
    wrapper.classList.add('field--invalid');
    wrapper.querySelector('.field__error').textContent = message;
    return true;
  }

  function showError(form, error) {
    const fields = error.fields || {};
    const unplaced = Object.entries(fields).filter(([name, message]) => !showFieldError(form, name, message));
    setMessage(form, unplaced.length || !Object.keys(fields).length ? error.message : '');
  }

  /** Wires `handler(values)` to the form: clears errors, disables the form while busy, shows failures. */
  function bind(form, handler) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clear(form);
      const buttons = form.querySelectorAll('button[type="submit"]');
      buttons.forEach((button) => { button.disabled = true; });
      try {
        await handler(values(form));
      } catch (error) {
        showError(form, error);
      } finally {
        buttons.forEach((button) => { button.disabled = false; });
      }
    });
  }

  Zanko.forms = { field, citySelect, gradeChoice, messageBox, setMessage, showFieldError, bind };
})(window.Zanko);

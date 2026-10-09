/**
 * components.js — reusable HTML fragments (return strings) and the toast notification.
 */
(function (Zanko) {
  'use strict';

  const { catalog, store, utils, icon } = Zanko;

  const TOAST_DURATION_MS = 2600;

  const courseUrl = (courseId) => `course.html?id=${courseId}`;
  const lessonUrl = (courseId, index) => `watch.html?id=${courseId}&lesson=${index}`;
  const subjectUrl = (subjectId) => `subject.html?id=${subjectId}`;

  /** Breadcrumb trail. Each item is { label, href? }; the last one has no link. */
  function crumbs(items) {
    const parts = items.map(({ label, href }) =>
      href ? `<a href="${href}">${label}</a>` : `<span>${label}</span>`);
    return `<div class="crumbs">${parts.join(' ‹ ')}</div>`;
  }

  /** Course cover: the supplied image, or a gradient with the subject's icon. */
  function cover(course) {
    if (course.cover) {
      return `<div class="cover" style="background-image:url('${course.cover}')"></div>`;
    }
    const subject = catalog.findSubject(course.subject);
    return `
      <div class="cover animated-gradient" style="background:${utils.gradient(subject.hue)}">
        <span class="cover__watermark">${icon(subject.id, 170, 1.4)}</span>
        <div class="cover__icon">${icon(subject.id, 34, 1.8)}</div>
      </div>`;
  }

  function courseCard(course) {
    const percent = store.progressPercent(course);
    return `
      <a class="card" href="${courseUrl(course.id)}">
        ${cover(course)}
        <div class="card__body">
          <h3>${course.title}</h3>
          <div class="teacher">${icon('user', 16)} ${course.teacher}</div>
          <div class="meta"><span>${course.lessons.length} وانە</span><span>${percent}%</span></div>
          <div class="progress"><div class="progress__bar" style="width:${percent}%"></div></div>
        </div>
      </a>`;
  }

  /** One lesson row. `showDuration` is used on the course page, `isCurrent` in the player playlist. */
  function lessonRow(course, index, { isCurrent = false, showDuration = false } = {}) {
    const lesson = course.lessons[index];
    const completed = store.isCompleted(course.id, index);
    const classes = ['lesson', completed && 'is-done', isCurrent && 'is-current'].filter(Boolean).join(' ');
    const duration = showDuration ? `<span class="text-muted">${lesson.duration || ''}</span>` : '';

    return `
      <a class="${classes}" href="${lessonUrl(course.id, index)}">
        <div class="lesson__num">${completed ? icon('check', 18, 3) : index + 1}</div>
        <div class="lesson__title">${lesson.title}</div>
        ${duration}
      </a>`;
  }

  /** Temporary floating message, e.g. "+20 XP". */
  function toast(message, iconName) {
    const element = document.createElement('div');
    element.className = 'toast';
    element.innerHTML = icon(iconName, 20) + message;
    document.body.appendChild(element);
    setTimeout(() => element.remove(), TOAST_DURATION_MS);
  }

  Zanko.components = { courseUrl, lessonUrl, subjectUrl, crumbs, cover, courseCard, lessonRow, toast };
})(window.Zanko);

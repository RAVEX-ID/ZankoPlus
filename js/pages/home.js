/**
 * pages/home.js — subject list for the chosen grade.
 */
(function (Zanko) {
  'use strict';

  const { store, config, catalog, components, utils, icon, layout } = Zanko;

  if (!utils.requireGrade()) return;
  layout.mount();

  const grade = store.grade;
  const gradeCourses = catalog.coursesByGrade(grade);

  function resumeCard() {
    const course = catalog.findCourse(store.recentCourseId);
    if (!course || course.grade != grade) return '';
    return `
      <div class="card resume-card">
        <div class="resume-card__info">
          <div class="text-muted">دوایین کۆرس</div>
          <b>${course.title}</b>
        </div>
        <a class="btn" href="${components.courseUrl(course.id)}">بەردەوامبە ${icon('next', 18)}</a>
      </div>`;
  }

  function subjectCard(subject) {
    const count = gradeCourses.filter((course) => course.subject === subject.id).length;
    return `
      <a class="subject-card animated-gradient" href="${components.subjectUrl(subject.id)}"
         style="background:${utils.gradient(subject.hue)}">
        <span class="subject-card__watermark">${icon(subject.id, 150, 1.4)}</span>
        <div class="subject-card__icon">${icon(subject.id, 28, 1.8)}</div>
        <div><b>${subject.name}</b><br><small>${count ? `${count} کۆرس` : 'بەم زووانە'}</small></div>
      </a>`;
  }

  document.getElementById('app').innerHTML = `
    ${components.crumbs([{ label: config.grades[grade].name }])}
    ${resumeCard()}
    <h1>بابەتەکان</h1>
    <p class="text-muted">بابەتێک هەڵبژێرە بۆ بینینی هەموو کۆرسەکانی.</p>
    <div class="subject-grid">${Zanko.subjects.map(subjectCard).join('')}</div>`;
})(window.Zanko);

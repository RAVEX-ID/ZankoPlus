/**
 * pages/course.js — course overview with its lesson list (?id=<courseId>).
 */
(function (Zanko) {
  'use strict';

  const { store, config, catalog, components, utils, icon } = Zanko;

  Zanko.app.start({ access: 'private' }, () => {
    const course = catalog.findCourse(utils.queryParam('id'));
    if (!course) {
      return utils.redirect('home.html');
    }

    const subject = catalog.findSubject(course.subject);
    const completedCount = store.completedLessons(course.id).length;
    const percent = store.progressPercent(course);
    const nextIndex = course.lessons.findIndex((_, index) => !store.isCompleted(course.id, index));
    const allDone = nextIndex < 0;

    function startLabel() {
      if (!completedCount) return 'دەست پێبکە';
      return allDone ? 'دووبارەکردنەوە' : 'بەردەوامبە';
    }

    const lessonRows = course.lessons
      .map((_, index) => components.lessonRow(course, index, { showDuration: true }))
      .join('');

    document.getElementById('app').innerHTML = `
      ${components.crumbs([
        { label: config.grades[course.grade].name, href: 'home.html' },
        { label: subject.name, href: components.subjectUrl(subject.id) },
        { label: 'کۆرس' },
      ])}
      <div class="course-hero">
        ${components.cover(course)}
        <div>
          <h1>${course.title}</h1>
          <div class="teacher">${icon('user', 17)} ${course.teacher}</div>
          <p class="text-muted">${course.description}</p>
          <div class="meta">
            <span>${completedCount} لە ${course.lessons.length} وانە تەواوکراوە</span><span>${percent}%</span>
          </div>
          <div class="progress"><div class="progress__bar" style="width:${percent}%"></div></div>
          <div class="actions">
            <a class="btn" href="${components.lessonUrl(course.id, allDone ? 0 : nextIndex)}">
              ${icon(allDone ? 'redo' : 'play', 18)} ${startLabel()}
            </a>
          </div>
        </div>
      </div>
      <h2>وانەکان (${course.lessons.length})</h2>
      ${lessonRows}`;
  });
})(window.Zanko);

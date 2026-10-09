/**
 * pages/subject.js — all courses of one subject for the chosen grade (?id=<subjectId>).
 */
(function (Zanko) {
  'use strict';

  const { store, config, catalog, components, utils } = Zanko;

  Zanko.app.start({ access: 'private' }, () => {
    const subject = catalog.findSubject(utils.queryParam('id'));
    if (!subject) {
      return utils.redirect('home.html');
    }

    const courses = catalog.coursesByGrade(store.grade).filter((course) => course.subject === subject.id);

    const content = courses.length
      ? `<p class="text-muted">کۆرسێک هەڵبژێرە و دەست بکە بە فێربوون.</p>
         <div class="course-grid">${courses.map(components.courseCard).join('')}</div>`
      : '<div class="card empty-state">هێشتا کۆرس بۆ ئەم بابەتە زیاد نەکراوە. بەم زووانە!</div>';

    document.getElementById('app').innerHTML = `
      ${components.crumbs([
        { label: config.grades[store.grade].name, href: 'home.html' },
        { label: subject.name },
      ])}
      <h1>کۆرسەکانی ${subject.name}</h1>
      ${content}`;
  });
})(window.Zanko);

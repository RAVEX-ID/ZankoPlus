/**
 * pages/watch.js — lesson player with playlist (?id=<courseId>&lesson=<index>).
 */
(function (Zanko) {
  'use strict';

  const { store, config, catalog, components, utils, icon, layout } = Zanko;

  Zanko.app.start({ access: 'private' }, () => {
    const course = catalog.findCourse(utils.queryParam('id'));
    const lessonIndex = Number(utils.queryParam('lesson'));
    if (!course || !course.lessons[lessonIndex]) {
      return utils.redirect('home.html');
    }

    const subject = catalog.findSubject(course.subject);
    const lesson = course.lessons[lessonIndex];
    const app = document.getElementById('app');

    const youtubeAllow = 'accelerometer;autoplay;encrypted-media;picture-in-picture;fullscreen';

    function player() {
      const url = lesson.videoUrl;
      if (!url) return `${icon('playCircle', 64, 1.4)}<div>ڤیدیۆکە لێرە دادەنرێت</div>`;
      if (utils.isDirectVideo(url)) return `<video src="${url}" controls></video>`;
      return `<iframe src="${utils.toEmbedUrl(url)}" referrerpolicy="strict-origin-when-cross-origin" ` +
        `allow="${youtubeAllow}" allowfullscreen></iframe>`;
    }

    function actions() {
      const completed = store.isCompleted(course.id, lessonIndex);
      const hasNext = lessonIndex < course.lessons.length - 1;
      const hasPrev = lessonIndex > 0;
      const hasYoutubeLink = lesson.videoUrl && !utils.isDirectVideo(lesson.videoUrl);

      const completeButton = completed
        ? `<button class="btn" disabled>${icon('check', 18, 3)} تەواوکراوە</button>`
        : `<button class="btn" data-action="complete">${icon('bolt', 18)} وانەکە تەواو بوو +${store.rules.xpPerLesson} خاڵ</button>`;

      return `
        <div class="actions">
          ${completeButton}
          ${hasNext ? `<a class="btn btn--outline" href="${components.lessonUrl(course.id, lessonIndex + 1)}">وانەی داهاتوو ${icon('next', 18)}</a>` : ''}
          ${hasPrev ? `<a class="btn btn--outline" href="${components.lessonUrl(course.id, lessonIndex - 1)}">${icon('prev', 18)} پێشوو</a>` : ''}
          ${hasYoutubeLink ? `<a class="btn btn--outline" href="${lesson.videoUrl}" target="_blank" rel="noopener">${icon('external', 18)} بینین لە یوتیوب</a>` : ''}
        </div>`;
    }

    function playlist() {
      return course.lessons
        .map((_, index) => components.lessonRow(course, index, { isCurrent: index === lessonIndex }))
        .join('');
    }

    function render() {
      app.innerHTML = `
        ${components.crumbs([
          { label: config.grades[course.grade].name, href: 'home.html' },
          { label: subject.name, href: components.subjectUrl(subject.id) },
          { label: course.title, href: components.courseUrl(course.id) },
          { label: `وانەی ${lessonIndex + 1}` },
        ])}
        <div class="watch-layout">
          <div>
            <div class="video-player">${player()}</div>
            <h1>وانەی ${lessonIndex + 1}: ${lesson.title}</h1>
            <div class="teacher">${icon('user', 17)} ${course.teacher}</div>
            ${actions()}
          </div>
          <div class="playlist">
            <h2 class="playlist__title">وانەکانی کۆرس</h2>
            ${playlist()}
          </div>
        </div>`;
    }

    async function completeLesson() {
      let result;
      try {
        result = await store.completeLesson(course, lessonIndex);
      } catch (error) {
        components.toast(error.message, 'bolt');
        return;
      }
      if (!result) return;

      let message = `+${store.rules.xpPerLesson} خاڵ`;
      let iconName = 'star';
      if (result.leveledUp) {
        message = `پیرۆزە! گەیشتیتە ئاستی ${store.level}`;
        iconName = 'trophy';
      } else if (result.courseFinished) {
        message = 'کۆرسەکەت تەواو کرد!';
        iconName = 'cap';
      }

      components.toast(message, iconName);
      layout.refreshHeader();
      render();
    }

    app.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="complete"]')) completeLesson();
    });

    render();
  });
})(window.Zanko);

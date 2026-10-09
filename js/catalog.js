/**
 * catalog.js — read-only queries over the subjects and courses data.
 */
(function (Zanko) {
  'use strict';

  Zanko.catalog = {
    findSubject: (id) => Zanko.subjects.find((subject) => subject.id === id),
    findCourse: (id) => Zanko.courses.find((course) => course.id === id),
    coursesByGrade: (grade) => Zanko.courses.filter((course) => course.grade == grade),
  };
})(window.Zanko);

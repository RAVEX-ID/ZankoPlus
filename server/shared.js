'use strict';

/**
 * Loads the browser-side data files (config, subjects, courses) so the frontend
 * and the API share ONE source of truth for XP rules, cities, and the course catalogue.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { publicDir } = require('./config');

const FILES = ['js/config.js', 'js/data/subjects.js', 'js/data/courses.js'];

function load() {
  const sandbox = {};
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  for (const file of FILES) {
    vm.runInContext(fs.readFileSync(path.join(publicDir, file), 'utf8'), sandbox, { filename: file });
  }
  return sandbox.Zanko;
}

const shared = load();

module.exports = {
  rules: { xpPerLesson: shared.config.xpPerLesson, xpPerLevel: shared.config.xpPerLevel },
  grades: Object.keys(shared.config.grades).map(Number),
  cities: shared.config.cities,
  courses: shared.courses,
  findCourse: (id) => shared.courses.find((course) => course.id === id),
};

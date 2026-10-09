/**
 * store.js — learner state (grade, XP, streak, completed lessons), persisted in localStorage.
 */
(function (Zanko) {
  'use strict';

  const { storageKey, xpPerLesson, xpPerLevel } = Zanko.config;
  const MS_PER_DAY = 864e5;

  let state = {
    xp: 0,
    streak: 0,
    last: '',      // last day a lesson was completed (Date#toDateString)
    done: {},      // { [courseId]: [completed lesson indexes] }
    grade: 0,
    recent: '',    // id of the last course worked on
  };

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) state = { ...state, ...JSON.parse(saved) };
  } catch (error) { /* storage unavailable — keep in-memory defaults */ }

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) { /* storage unavailable */ }
  }

  function updateStreak() {
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now - MS_PER_DAY).toDateString();

    if (state.last === today) return;
    state.streak = state.last === yesterday ? state.streak + 1 : 1;
    state.last = today;
  }

  const completedLessons = (courseId) => state.done[courseId] || [];

  const store = {
    get grade() { return state.grade; },
    get xp() { return state.xp; },
    get streak() { return state.streak; },
    get recentCourseId() { return state.recent; },
    get level() { return Math.floor(state.xp / xpPerLevel) + 1; },
    get levelProgress() { return state.xp % xpPerLevel; },

    setGrade(grade) {
      state.grade = grade;
      persist();
    },

    completedLessons,

    isCompleted: (courseId, index) => completedLessons(courseId).includes(index),

    progressPercent: (course) =>
      Math.round((completedLessons(course.id).length / course.lessons.length) * 100),

    /**
     * Marks a lesson as completed and awards XP.
     * Returns { leveledUp, courseFinished }, or null if it was already completed.
     */
    completeLesson(course, index) {
      if (store.isCompleted(course.id, index)) return null;

      const levelBefore = store.level;
      if (!state.done[course.id]) state.done[course.id] = [];
      state.done[course.id].push(index);

      state.recent = course.id;
      state.xp += xpPerLesson;
      updateStreak();
      persist();

      return {
        leveledUp: store.level > levelBefore,
        courseFinished: state.done[course.id].length === course.lessons.length,
      };
    },
  };

  Zanko.store = store;
})(window.Zanko);

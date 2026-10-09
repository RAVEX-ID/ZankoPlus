/**
 * store.js — the signed-in learner: profile, XP, streak and completed lessons.
 * The server is the source of truth; this module keeps an in-memory copy per page.
 */
(function (Zanko) {
  'use strict';

  const { api, config } = Zanko;

  let user = null;
  let rules = { xpPerLesson: config.xpPerLesson, xpPerLevel: config.xpPerLevel };
  let state = { xp: 0, streak: 0, recentCourseId: '', completed: {} };

  /** Applies a `{ user, state, rules }` response from the API. */
  function apply(data) {
    user = data.user;
    state = data.state;
    if (data.rules) rules = data.rules;
    return user;
  }

  const completedLessons = (courseId) => state.completed[courseId] || [];

  const store = {
    /** Loads the current session. Resolves quietly when nobody is signed in. */
    async init() {
      try {
        apply(await api.get('/me'));
      } catch (error) {
        if (error.status !== 401) throw error;
        user = null;
      }
    },

    register: async (values) => apply(await api.post('/auth/register', values)),
    login: async (values) => apply(await api.post('/auth/login', values)),
    updateProfile: async (values) => apply(await api.patch('/me', values)),
    changePassword: (values) => api.put('/me/password', values),

    async logout() {
      await api.post('/auth/logout');
      user = null;
    },

    async deleteAccount(password) {
      await api.delete('/me', { password });
      user = null;
    },

    get isAuthenticated() { return user !== null; },
    get user() { return user; },
    get grade() { return user ? user.grade : 0; },
    get rules() { return rules; },
    get xp() { return state.xp; },
    get streak() { return state.streak; },
    get recentCourseId() { return state.recentCourseId; },
    get level() { return Math.floor(state.xp / rules.xpPerLevel) + 1; },
    get levelProgress() { return state.xp % rules.xpPerLevel; },
    get completedTotal() {
      return Object.values(state.completed).reduce((sum, lessons) => sum + lessons.length, 0);
    },

    completedLessons,
    isCompleted: (courseId, index) => completedLessons(courseId).includes(index),

    progressPercent: (course) =>
      Math.round((completedLessons(course.id).length / course.lessons.length) * 100),

    /**
     * Marks a lesson as completed on the server.
     * Returns { leveledUp, courseFinished }, or null if it was already completed.
     */
    async completeLesson(course, index) {
      const levelBefore = store.level;
      const { completedNow, state: newState } =
        await api.post('/progress/complete', { courseId: course.id, lessonIndex: index });
      state = newState;
      if (!completedNow) return null;

      return {
        leveledUp: store.level > levelBefore,
        courseFinished: completedLessons(course.id).length === course.lessons.length,
      };
    },
  };

  Zanko.store = store;
})(window.Zanko);

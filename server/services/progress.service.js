'use strict';

const db = require('../db');
const { timezone } = require('../config');
const { rules, findCourse } = require('../shared');
const { AppError } = require('../errors');

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const dayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone });
const dayKey = (date) => dayFormatter.format(date); // YYYY-MM-DD in the learners' timezone

const statements = {
  stats: db.prepare('SELECT * FROM user_stats WHERE user_id = ?'),
  lessons: db.prepare(
    'SELECT course_id, lesson_index FROM lesson_progress WHERE user_id = ? ORDER BY course_id, lesson_index'),
  insertLesson: db.prepare(
    'INSERT OR IGNORE INTO lesson_progress (user_id, course_id, lesson_index) VALUES (?, ?, ?)'),
  updateStats: db.prepare(`
    UPDATE user_stats
    SET xp = ?, streak = ?, last_active_day = ?, recent_course_id = ?
    WHERE user_id = ?`),
};

/** Everything the UI needs about a learner's progress. */
function getState(userId) {
  const stats = statements.stats.get(userId);
  const completed = {};
  for (const row of statements.lessons.all(userId)) {
    (completed[row.course_id] ||= []).push(row.lesson_index);
  }
  return {
    xp: stats.xp,
    streak: stats.streak,
    recentCourseId: stats.recent_course_id || '',
    completed,
  };
}

const record = db.transaction((userId, courseId, lessonIndex) => {
  const inserted = statements.insertLesson.run(userId, courseId, lessonIndex).changes === 1;
  if (!inserted) return false;

  const stats = statements.stats.get(userId);
  const now = new Date();
  const today = dayKey(now);
  let streak = stats.streak;
  if (stats.last_active_day !== today) {
    streak = stats.last_active_day === dayKey(new Date(now - MS_PER_DAY)) ? streak + 1 : 1;
  }
  statements.updateStats.run(stats.xp + rules.xpPerLesson, streak, today, courseId, userId);
  return true;
});

/** Marks a lesson done (idempotent). XP is computed here, never trusted from the client. */
function completeLesson(userId, courseId, lessonIndex) {
  const course = findCourse(courseId);
  if (!course) throw new AppError(404, 'کۆرسەکە نەدۆزرایەوە');
  if (!course.lessons[lessonIndex]) throw new AppError(400, 'وانەکە نەدۆزرایەوە');

  const completedNow = record(userId, courseId, lessonIndex);
  return { completedNow, state: getState(userId) };
}

module.exports = { getState, completeLesson };

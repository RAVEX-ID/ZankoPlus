'use strict';

const db = require('../db');

const statements = {
  insertUser: db.prepare(`
    INSERT INTO users (email, password_hash, full_name, phone, grade, city, school)
    VALUES (@email, @passwordHash, @fullName, @phone, @grade, @city, @school)`),
  insertStats: db.prepare('INSERT INTO user_stats (user_id) VALUES (?)'),
  byEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  byId: db.prepare('SELECT * FROM users WHERE id = ?'),
  updateProfile: db.prepare(`
    UPDATE users SET full_name = @fullName, phone = @phone, grade = @grade, city = @city, school = @school
    WHERE id = @id`),
  updatePassword: db.prepare(
    'UPDATE users SET password_hash = ?, token_version = token_version + 1 WHERE id = ?'),
  touchLogin: db.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?"),
  remove: db.prepare('DELETE FROM users WHERE id = ?'),
};

/** Strips secrets; this is the only user shape that ever leaves the server. */
function toPublic(row) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    grade: row.grade,
    city: row.city,
    school: row.school,
    createdAt: row.created_at,
  };
}

const createWithStats = db.transaction((data) => {
  const { lastInsertRowid } = statements.insertUser.run(data);
  statements.insertStats.run(lastInsertRowid);
  return statements.byId.get(lastInsertRowid);
});

module.exports = {
  toPublic,
  create: (data) => createWithStats(data),
  findByEmail: (email) => statements.byEmail.get(email),
  findById: (id) => statements.byId.get(id),
  updateProfile: (id, data) => {
    statements.updateProfile.run({ id, ...data });
    return statements.byId.get(id);
  },
  updatePassword: (id, hash) => {
    statements.updatePassword.run(hash, id);
    return statements.byId.get(id);
  },
  touchLogin: (id) => statements.touchLogin.run(id),
  remove: (id) => statements.remove.run(id),
};

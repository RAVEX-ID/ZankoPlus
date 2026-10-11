'use strict';

/**
 * SQLite via Node's built-in `node:sqlite` (Node 22.13+) — no native add-on to compile,
 * so it runs identically on any host. The tiny wrapper below keeps the prepare/exec/transaction
 * API the services use.
 */
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { databaseFile } = require('./config');

if (databaseFile !== ':memory:') fs.mkdirSync(path.dirname(databaseFile), { recursive: true });

const database = new DatabaseSync(databaseFile);
database.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    email          TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash  TEXT NOT NULL,
    token_version  INTEGER NOT NULL DEFAULT 0,
    full_name      TEXT NOT NULL,
    phone          TEXT,
    grade          INTEGER NOT NULL CHECK (grade IN (10, 11, 12)),
    city           TEXT,
    school         TEXT,
    created_at     TEXT NOT NULL DEFAULT (datetime('now')),
    last_login_at  TEXT
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    user_id           INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    xp                INTEGER NOT NULL DEFAULT 0,
    streak            INTEGER NOT NULL DEFAULT 0,
    last_active_day   TEXT,
    recent_course_id  TEXT
  );

  CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id     TEXT NOT NULL,
    lesson_index  INTEGER NOT NULL,
    completed_at  TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, course_id, lesson_index)
  );
`);

/** Wraps `fn` so every call runs inside one transaction (rolled back if it throws). */
function transaction(fn) {
  return (...args) => {
    database.exec('BEGIN IMMEDIATE');
    try {
      const result = fn(...args);
      database.exec('COMMIT');
      return result;
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  };
}

module.exports = {
  prepare: (sql) => database.prepare(sql),
  exec: (sql) => database.exec(sql),
  transaction,
};

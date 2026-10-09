'use strict';

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { databaseFile } = require('./config');

if (databaseFile !== ':memory:') fs.mkdirSync(path.dirname(databaseFile), { recursive: true });

const db = new Database(databaseFile);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
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

module.exports = db;

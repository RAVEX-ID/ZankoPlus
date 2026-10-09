'use strict';

const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { Router } = require('express');
const config = require('../config');
const users = require('../services/users.service');
const progress = require('../services/progress.service');
const { rules } = require('../shared');
const { AppError } = require('../errors');
const { validate } = require('../validation');
const { startSession, endSession } = require('../middleware/auth');

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: { message: 'هەوڵی زۆرت دا. تکایە دواتر دووبارە هەوڵ بدەرەوە.' } },
});

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', config.bcryptRounds);

const session = (row) => ({ user: users.toPublic(row), state: progress.getState(row.id), rules });

router.post('/register', limiter, validate('register'), async (req, res) => {
  const { password, ...profile } = req.body;

  if (users.findByEmail(profile.email)) {
    throw new AppError(409, 'ئەم ئیمەیڵە پێشتر بەکارهاتووە', { email: 'ئەم ئیمەیڵە پێشتر بەکارهاتووە' });
  }

  const passwordHash = await bcrypt.hash(password, config.bcryptRounds);
  const row = users.create({ ...profile, passwordHash });

  startSession(res, row);
  res.status(201).json(session(row));
});

router.post('/login', limiter, validate('login'), async (req, res) => {
  const { email, password } = req.body;
  const row = users.findByEmail(email);

  const valid = await bcrypt.compare(password, row ? row.password_hash : DUMMY_HASH);
  if (!row || !valid) throw new AppError(401, 'ئیمەیڵ یان وشەی نهێنی هەڵەیە');

  users.touchLogin(row.id);
  startSession(res, row);
  res.json(session(row));
});

router.post('/logout', (req, res) => {
  endSession(res);
  res.status(204).end();
});

module.exports = router;

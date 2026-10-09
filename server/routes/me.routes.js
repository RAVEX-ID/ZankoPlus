'use strict';

const bcrypt = require('bcryptjs');
const { Router } = require('express');
const config = require('../config');
const users = require('../services/users.service');
const progress = require('../services/progress.service');
const { rules } = require('../shared');
const { AppError } = require('../errors');
const { validate } = require('../validation');
const { requireAuth, startSession, endSession } = require('../middleware/auth');

const router = Router();
router.use(requireAuth);

const session = (row) => ({ user: users.toPublic(row), state: progress.getState(row.id), rules });

async function assertPassword(row, password, field) {
  if (!(await bcrypt.compare(password, row.password_hash))) {
    throw new AppError(400, 'وشەی نهێنی هەڵەیە', { [field]: 'وشەی نهێنی هەڵەیە' });
  }
}

router.get('/', (req, res) => {
  res.json(session(req.user));
});

router.patch('/', validate('profile'), (req, res) => {
  res.json(session(users.updateProfile(req.user.id, req.body)));
});

router.put('/password', validate('password'), async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await assertPassword(req.user, currentPassword, 'currentPassword');

  const hash = await bcrypt.hash(newPassword, config.bcryptRounds);
  const row = users.updatePassword(req.user.id, hash);
  startSession(res, row); // keep this device signed in; all others are signed out
  res.json({ ok: true });
});

router.delete('/', validate('deleteAccount'), async (req, res) => {
  await assertPassword(req.user, req.body.password, 'password');
  users.remove(req.user.id);
  endSession(res);
  res.status(204).end();
});

module.exports = router;

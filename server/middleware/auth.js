'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');
const users = require('../services/users.service');
const { AppError } = require('../errors');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.isProduction,
  path: '/',
};

/** Signs a session token for `userRow` and sets it as an httpOnly cookie. */
function startSession(res, userRow) {
  const token = jwt.sign({ sub: userRow.id, tv: userRow.token_version }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  res.cookie(config.cookieName, token, { ...cookieOptions, maxAge: config.cookieMaxAgeMs });
}

function endSession(res) {
  res.clearCookie(config.cookieName, cookieOptions);
}

/** Requires a valid session; exposes the user row as req.user. */
function requireAuth(req, res, next) {
  const unauthorized = new AppError(401, 'تکایە بچۆ ژوورەوە');
  const token = req.cookies[config.cookieName];
  if (!token) throw unauthorized;

  let payload;
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw unauthorized;
  }

  const user = users.findById(payload.sub);
  // token_version changes on password change, which signs out every other device.
  if (!user || user.token_version !== payload.tv) throw unauthorized;

  req.user = user;
  next();
}

module.exports = { startSession, endSession, requireAuth };

'use strict';

const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const ROOT = path.join(__dirname, '..');

function resolveJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (isProduction) throw new Error('JWT_SECRET must be set in production');
  console.warn('[config] JWT_SECRET is not set — using a temporary secret (sessions reset on restart).');
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  isProduction,
  port: Number(process.env.PORT) || 3000,
  trustProxy: process.env.TRUST_PROXY === '1',
  timezone: process.env.APP_TIMEZONE || 'Asia/Baghdad',
  databaseFile: process.env.DATABASE_FILE || path.join(ROOT, 'data', 'zankoplus.db'),
  publicDir: path.join(ROOT, 'public'),

  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: '7d',
  cookieName: 'zp_token',
  cookieMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
  bcryptRounds: 12,
};

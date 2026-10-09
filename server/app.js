'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const config = require('./config');
const { AppError, notFound, errorHandler } = require('./errors');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ['https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      mediaSrc: ["'self'", 'https:'],
      frameSrc: ['https://www.youtube-nocookie.com', 'https://www.youtube.com'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: config.isProduction ? [] : null,
    },
  },
}));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// ---- API -------------------------------------------------------------------
const api = express.Router();

api.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// A cross-site form cannot send application/json without a CORS preflight,
// so requiring it on writes (together with SameSite=Lax cookies) blocks CSRF.
api.use((req, res, next) => {
  const isWrite = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  if (isWrite && !req.is('application/json')) throw new AppError(415, 'داواکارییەکە دروست نییە');
  next();
});

api.use('/auth', require('./routes/auth.routes'));
api.use('/me', require('./routes/me.routes'));
api.use('/progress', require('./routes/progress.routes'));
api.use(notFound);

app.use('/api', api);

// ---- Frontend --------------------------------------------------------------
app.use(express.static(config.publicDir, { extensions: ['html'] }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;

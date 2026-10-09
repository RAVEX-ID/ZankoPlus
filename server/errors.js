'use strict';

class AppError extends Error {
  /** @param {number} status HTTP status  @param {string} message Kurdish, user-facing  @param {object} [fields] per-field messages */
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

function notFound(req, res) {
  res.status(404).json({ error: { message: 'نەدۆزرایەوە' } });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { message: err.message, fields: err.fields } });
  }
  if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') {
    return res.status(400).json({ error: { message: 'داواکارییەکە دروست نییە' } });
  }
  console.error('[error]', err);
  return res.status(500).json({ error: { message: 'هەڵەیەک لە سێرڤەر ڕوویدا' } });
}

module.exports = { AppError, notFound, errorHandler };

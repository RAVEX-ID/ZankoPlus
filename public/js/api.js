/**
 * api.js — thin fetch wrapper for the backend. Throws ApiError with a Kurdish message
 * and, for validation failures, per-field messages.
 */
(function (Zanko) {
  'use strict';

  class ApiError extends Error {
    constructor(status, message, fields = {}) {
      super(message);
      this.status = status;
      this.fields = fields;
    }
  }

  async function request(method, path, body) {
    let response;
    try {
      response = await fetch(`/api${path}`, {
        method,
        credentials: 'same-origin',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      throw new ApiError(0, 'پەیوەندی بە سێرڤەرەوە نییە. دووبارە هەوڵ بدەرەوە.');
    }

    const data = response.status === 204 ? {} : await response.json().catch(() => ({}));
    if (!response.ok) {
      const { message = 'هەڵەیەک ڕوویدا', fields } = data.error || {};
      throw new ApiError(response.status, message, fields);
    }
    return data;
  }

  Zanko.api = {
    ApiError,
    get: (path) => request('GET', path),
    post: (path, body = {}) => request('POST', path, body),
    patch: (path, body) => request('PATCH', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path, body = {}) => request('DELETE', path, body),
  };
})(window.Zanko);

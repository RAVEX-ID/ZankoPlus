'use strict';

process.env.NODE_ENV = 'test';
process.env.DATABASE_FILE = ':memory:';

const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server/app');

let server;
let base;

test.before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    base = `http://127.0.0.1:${server.address().port}`;
    resolve();
  });
}));
test.after(() => server.close());

/** Minimal client that keeps the session cookie between calls. */
function client() {
  let cookie = '';
  return async (method, path, body) => {
    const response = await fetch(base + path, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const set = response.headers.getSetCookie().find((c) => c.startsWith('zp_token='));
    if (set) cookie = set.split(';')[0];
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null, setCookie: set };
  };
}

const student = {
  fullName: 'ئاراس ئەحمەد', email: 'Aras@Example.com', password: 'secret123',
  grade: 11, city: 'هەولێر', phone: '', school: '',
};

test('register creates an account, normalises email and starts a session', async () => {
  const api = client();
  const res = await api('POST', '/api/auth/register', student);
  assert.equal(res.status, 201);
  assert.equal(res.body.user.email, 'aras@example.com');
  assert.equal(res.body.user.phone, null);
  assert.equal(res.body.user.passwordHash, undefined);
  assert.match(res.setCookie, /HttpOnly/i);
  assert.equal(res.body.state.xp, 0);
});

test('register rejects duplicates and invalid data with per-field messages', async () => {
  const api = client();
  const dup = await api('POST', '/api/auth/register', student);
  assert.equal(dup.status, 409);
  assert.ok(dup.body.error.fields.email);

  const bad = await api('POST', '/api/auth/register', { ...student, email: 'x', password: 'short', grade: 9 });
  assert.equal(bad.status, 400);
  assert.deepEqual(Object.keys(bad.body.error.fields).sort(), ['email', 'grade', 'password']);
});

test('login: wrong password is rejected, right password works', async () => {
  const api = client();
  assert.equal((await api('POST', '/api/auth/login', { email: 'aras@example.com', password: 'nope' })).status, 401);
  assert.equal((await api('POST', '/api/auth/login', { email: 'nobody@example.com', password: 'secret123' })).status, 401);
  assert.equal((await api('POST', '/api/auth/login', { email: 'ARAS@example.com', password: 'secret123' })).status, 200);
  assert.equal((await api('GET', '/api/me')).status, 200);
});

test('private endpoints require a session; writes require JSON', async () => {
  assert.equal((await client()('GET', '/api/me')).status, 401);
  const res = await fetch(`${base}/api/auth/logout`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'x' });
  assert.equal(res.status, 415);
});

test('completing a lesson awards XP once, tracks streak and validates input', async () => {
  const api = client();
  await api('POST', '/api/auth/login', { email: 'aras@example.com', password: 'secret123' });

  const first = await api('POST', '/api/progress/complete', { courseId: 'ph11a', lessonIndex: 0 });
  assert.equal(first.status, 200);
  assert.equal(first.body.completedNow, true);
  assert.equal(first.body.state.xp, 20);
  assert.equal(first.body.state.streak, 1);
  assert.deepEqual(first.body.state.completed.ph11a, [0]);

  const again = await api('POST', '/api/progress/complete', { courseId: 'ph11a', lessonIndex: 0 });
  assert.equal(again.body.completedNow, false);
  assert.equal(again.body.state.xp, 20);

  assert.equal((await api('POST', '/api/progress/complete', { courseId: 'nope', lessonIndex: 0 })).status, 404);
  assert.equal((await api('POST', '/api/progress/complete', { courseId: 'ph11a', lessonIndex: 99 })).status, 400);

  const me = await api('GET', '/api/me');
  assert.equal(me.body.state.xp, 20);
});

test('profile update persists; password change signs out other devices', async () => {
  const phone = client();
  const laptop = client();
  await phone('POST', '/api/auth/login', { email: 'aras@example.com', password: 'secret123' });
  await laptop('POST', '/api/auth/login', { email: 'aras@example.com', password: 'secret123' });

  const updated = await phone('PATCH', '/api/me', { fullName: 'ئاراس', grade: 12, city: 'سلێمانی', phone: '0750 123 4567', school: 'قوتابخانەی ئاسۆ' });
  assert.equal(updated.status, 200);
  assert.equal(updated.body.user.grade, 12);

  const wrong = await phone('PUT', '/api/me/password', { currentPassword: 'bad', newPassword: 'newpass123' });
  assert.equal(wrong.status, 400);
  assert.ok(wrong.body.error.fields.currentPassword);

  assert.equal((await phone('PUT', '/api/me/password', { currentPassword: 'secret123', newPassword: 'newpass123' })).status, 200);
  assert.equal((await phone('GET', '/api/me')).status, 200);   // this device stays signed in
  assert.equal((await laptop('GET', '/api/me')).status, 401);  // other device is signed out
});

test('delete account removes the user and their progress', async () => {
  const api = client();
  await api('POST', '/api/auth/login', { email: 'aras@example.com', password: 'newpass123' });
  assert.equal((await api('DELETE', '/api/me', { password: 'wrong' })).status, 400);
  assert.equal((await api('DELETE', '/api/me', { password: 'newpass123' })).status, 204);
  assert.equal((await client()('POST', '/api/auth/login', { email: 'aras@example.com', password: 'newpass123' })).status, 401);
});

# زانکۆپلەس (ZankoPlus)

Learning platform for grades 10–12 in the Kurdistan Region — accounts, personal profile,
XP / levels / streak and per-lesson progress, backed by a Node.js API and SQLite.

## Run it

```bash
npm install
cp .env.example .env     # then set JWT_SECRET (see the file)
npm start                # http://localhost:3000
npm test                 # API integration tests
```

Requires Node 20+. The server also serves the frontend from `public/`, so there is nothing else to run.

## Structure

```
server/
  index.js, app.js        entry point, Express app (helmet CSP, JSON-only writes, static files)
  config.js               environment configuration
  shared.js               loads public/js config + data so XP rules and the catalogue exist once
  db.js                   SQLite schema (users, user_stats, lesson_progress)
  validation.js           zod schemas with Kurdish messages
  errors.js               AppError + error handler
  middleware/auth.js      JWT session cookie (httpOnly, SameSite=Lax)
  routes/                 auth, me (profile), progress
  services/               users + progress logic (all SQL lives here)
public/                   the website (multi-page, no build step)
  js/data/courses.js      ← add courses, covers and YouTube links here
tests/api.test.js
```

## API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account and sign in |
| POST | `/api/auth/login` | – | Sign in |
| POST | `/api/auth/logout` | – | Sign out |
| GET | `/api/me` | ✓ | Profile + progress state |
| PATCH | `/api/me` | ✓ | Update personal info (name, grade, city, phone, school) |
| PUT | `/api/me/password` | ✓ | Change password (signs out other devices) |
| DELETE | `/api/me` | ✓ | Delete account and all progress |
| POST | `/api/progress/complete` | ✓ | `{ courseId, lessonIndex }` → awards XP once |

## Security notes

- Passwords: bcrypt (12 rounds); minimum 8 characters with a letter and a digit.
- Sessions: signed JWT in an `httpOnly`, `SameSite=Lax` cookie (`Secure` in production); changing the password invalidates all other sessions.
- Writes must be `application/json` (blocks cross-site form posts); login/register are rate-limited; login timing does not reveal which emails exist.
- XP, levels and streaks are computed on the server — the client cannot award itself points.
- Every user-supplied value is escaped before being rendered; CSP allows only own scripts.

## Deploying

Set `NODE_ENV=production`, `JWT_SECRET`, `TRUST_PROXY=1` (behind a proxy) and keep `data/` on a persistent disk
(or set `DATABASE_FILE`). HTTPS is required for the secure cookie. SQLite suits a single server; for several
servers, move `server/db.js` + `services/` to PostgreSQL.

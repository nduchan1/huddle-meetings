# Huddle API

REST API for Huddle, written in TypeScript on Node.js with Express 5 and PostgreSQL (node-postgres). Live at https://huddle-api-mu.vercel.app.

## Running

```bash
npm install
npm run dev        # development server with reload, http://localhost:3001
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | Compiles `src/` to `dist/` |
| `npm start` | Runs the compiled server (`dist/server.js`) |
| `npm run typecheck` | Type-checks without emitting |
| `npm run lint` | Lints with oxlint |
| `npm test` | Runs the API tests (needs `TEST_DATABASE_URL`, see below) |
| `npm run db:init` | Creates the tables and loads the sample data into the database in `DATABASE_URL` (`--no-seed` skips the data) |

## Configuration

Settings are read from `.env` (see `.env.example`):

| Variable | Meaning |
| --- | --- |
| `PORT` | Port to listen on (default 3001) |
| `DATABASE_URL` | PostgreSQL connection string. The one shipped in `.env` points at the Neon database with a role that can only read and write the application tables. |
| `CORS_ORIGINS` | Comma-separated browser origins allowed to call the API |

## Routes

| Method | Route | Response |
| --- | --- | --- |
| GET | `/api/health` | `200 { status, database, time }`, `503` when the database is unreachable |
| GET | `/api/teams` | `200 Team[]` |
| GET | `/api/teams/:teamId/meetings` | `200 Meeting[]` ordered by start time, `404` unknown team |
| GET | `/api/meetings/:id` | `200 Meeting`, `404` unknown meeting |
| POST | `/api/meetings` | `201 Meeting`, `400` validation error |
| PUT | `/api/meetings/:id` | `200 Meeting`, `400` validation error, `404` unknown meeting |
| DELETE | `/api/meetings/:id` | `204`, `404` unknown meeting |

Shapes:

```json
Team    { "id": 1, "name": "UI Team" }
Meeting { "id": 3, "teamId": 1, "teamName": "UI Team",
          "startTime": "2026-09-22T06:30:00.000Z", "endTime": "2026-09-22T07:30:00.000Z",
          "description": "Q4 component roadmap", "room": "Blue Room" }
```

`POST` and `PUT` take `{ teamId, startTime, endTime, description, room }`. Rules: every field is required, the team must exist, the end must be after the start, and on `POST` the start must not be in the past (updating a meeting that already happened is allowed). All failing fields are reported together:

```json
{ "error": "Validation failed", "fields": { "startTime": "Start time cannot be in the past", "room": "Room is required" } }
```

Invalid ids give `400 { "error": "Invalid meeting id" }`, unknown routes `404 { "error": "Route not found" }` and malformed JSON `400 { "error": "Malformed JSON body" }`.

## Code layout

```
src/server.ts        loads .env and starts listening
src/app.ts           builds the Express app (CORS, JSON, routes, 404, error handler)
src/config.ts        environment variables
src/db.ts            connection pool
src/routes/          route definitions
src/controllers/     request handling
src/services/        SQL queries
src/validation/      request validation (zod) and id parsing
src/middleware/      not-found and error handlers
scripts/db-init.ts   applies ../Database/schema.sql and seed.sql
tests/api.test.ts    integration tests (vitest + supertest)
postman/             Postman collection and local environment
```

## Tests

The tests run every route against a real PostgreSQL database and recreate the tables in it, so they need a database of their own:

```bash
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/huddle_test npm test
```

Without `TEST_DATABASE_URL` the suite is skipped.

## Postman

Import `postman/Huddle-API.postman_collection.json` (Collection v2.1) and run it top to bottom. It targets the live API by default; import and select `postman/Huddle-Local.postman_environment.json` to point it at http://localhost:3001. The same run from the terminal:

```bash
npx newman run postman/Huddle-API.postman_collection.json -e postman/Huddle-Local.postman_environment.json
```

## Deployment

The API is deployed to Vercel from this folder (`src/app.ts` is the entry point, `vercel.json` pins the Frankfurt region). `DATABASE_URL` and `CORS_ORIGINS` are set as Vercel environment variables.

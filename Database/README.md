# Database

PostgreSQL database for Huddle, hosted on [Neon](https://neon.tech) (PostgreSQL 18).

| File | What it is |
| --- | --- |
| `schema.sql` | Creates the two tables: `teams` and `meetings` (drops them first, so it can be re-run). |
| `seed.sql` | Sample data: 6 development teams and 27 meetings, some in the past and some in the future. |
| `huddle_meetings.sql` | Full export of the live database made with `pg_dump` (schema + data). Use it to recreate the database exactly as submitted. |

## Tables

**teams**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | integer, identity | primary key (team code) |
| `name` | text | unique, e.g. "UI Team", "Mobile Team", "React Team" |

**meetings**

| Column | Type | Notes |
| --- | --- | --- |
| `id` | integer, identity | primary key (meeting code) |
| `team_id` | integer | foreign key to `teams.id` |
| `start_time` | timestamptz | date and time the meeting starts (one field) |
| `end_time` | timestamptz | date and time the meeting ends (one field), must be after `start_time` |
| `description` | text | what the meeting is about |
| `room` | text | e.g. "Blue Room", "New York Room", "Large Board Room" |

Times are stored in UTC and shown in the browser's local time zone.

## Recreating the database

Pick whichever is most convenient:

- **Neon SQL Editor** (or any SQL client): open `huddle_meetings.sql` and run it against an empty database. Alternatively run `schema.sql` followed by `seed.sql`.
- **psql**:

  ```bash
  psql "postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require" -f huddle_meetings.sql
  ```

- **From the Backend project** (uses the `DATABASE_URL` in `Backend/.env`, which must be a role allowed to create tables):

  ```bash
  cd ../Backend
  npm run db:init
  ```

The backend only needs a role that can read and write rows in these two tables; the connection string shipped in `Backend/.env` uses such a role.

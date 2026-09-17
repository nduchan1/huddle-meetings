# Huddle frontend

Single-page application built with React 19, TypeScript, React Router and Vite, styled with hand-written CSS. Live at https://nduchan1.github.io/huddle-meetings/.

## Running

```bash
npm install
npm run dev        # http://localhost:5173
```

The API address comes from `.env` (`VITE_API_URL`, default `http://localhost:3001`). Start the backend first (see `../Backend`).

Other scripts: `npm run build` (production bundle in `dist/`), `npm run preview` (serves the bundle), `npm run lint` (oxlint).

## Pages

| Route | Page |
| --- | --- |
| `#/` | Home: introduction and illustration |
| `#/meetings` | Meetings: team Select, cards split into Upcoming (orange) and Past (green), delete with confirmation. The chosen team is kept in the URL (`?team=1`). |
| `#/meetings/new` | New meeting form |
| `#/meetings/:id/edit` | Edit meeting form |
| `#/about` | About the system and the author |

Routing uses `HashRouter` and the build uses a relative base path so the site works on GitHub Pages without server configuration.

## Code layout

```
src/api/          fetch wrappers for the API (typed, with an ApiError for failed requests)
src/components/   layout, buttons, meeting card, meeting form, dialog, toasts, icons
src/hooks/        data loading (teams, meetings, one meeting), clock, toasts, page title
src/lib/          date/time formatting and duration, form validation (same rules and messages as the API)
src/pages/        one component per route
src/styles/       design tokens, layout, components and page styles
```

Times are stored in UTC by the API and shown in the browser's local time zone. The meetings list re-checks the clock every 30 seconds, so a meeting turns from orange to green when its start time passes.

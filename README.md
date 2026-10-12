# Live Football World Cup Scoreboard

A React and TypeScript application for managing football matches and tracking their scores in real time.

## Getting Started

### Prerequisites

- Node.js 22.23.3 (see `.nvmrc`)
- npm 10+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL printed in the terminal `http://localhost:5173`.

## Architecture Decisions

### Routing Strategy

The application uses `HashRouter` from React Router DOM v7
to ensure reliable client-side navigation on GitHub Pages.

GitHub Pages does not natively support SPA fallback routing.
With `BrowserRouter`, directly opening or refreshing a nested
route may return a 404 because the server attempts to locate
a corresponding file or directory.

`HashRouter` stores the route in the URL fragment
(e.g., `/#/matches`), which is not sent to the server.
This enables client-side routing without additional server
configuration or a custom 404 workaround.

**Trade-off:** URLs contain a `#` fragment. This is an
acceptable compromise for a static GitHub Pages deployment.
The routing strategy can be revisited if the application
moves to hosting with native SPA fallback support.

### Shared Match State

ScoreboardProvider owns the shared match state and exposes it through the typed useScoreboard hook.

React Context is used because multiple routes, including In Progress, Finished, and the planned Activity/History tab, need to access and update the same match state throughout its lifecycle.

A custom hook alone would not provide shared state, as each call would create an independent state instance. The provider ensures a single shared state source, while useScoreboard encapsulates Context access behind a feature-specific API.

### End-to-End Testing

Install the Chromium browser used by Playwright:

```bash
npx playwright install chromium
```

Run the E2E suite against a production build:

```bash
npm run test:e2e
```

Use `npm run test:e2e:ui` for Playwright's interactive UI mode.

CI runs quality checks first and then the Chromium E2E suite. The deploy
workflow only runs after the complete CI workflow succeeds. To prevent merging
a failing pull request, configure `CI / quality` and `CI / e2e` as required
checks in the `main` branch protection rules after both checks have run on
GitHub at least once.

### Match Management

- The first view loads five in-progress matches from a fake API. A short loader
  is shown while that request is in progress, and a failure offers a retry.
  After loading, matches are kept in a `Map` so score updates and match
  completion can find a match by id. The changelog stays a list of events.
- New matches start at `0:0` and receive the next local ID after the loaded set.
- Team names are required, must differ, and a team may participate in only one
  active match at a time.
- Scores are non-negative whole numbers, and each score is at most 20.
- Matches in progress and finished matches use the same order: total goals,
  descending. Ties are ordered by the most recently started match.
- Clicking a match row opens the editor on purpose. A row button runs only its
  own action: edit opens the editor, and finish asks for confirmation.
- Finishing a match requires confirmation and moves it to the Finished matches
  view without changing its score. Confirming the finish shows a success toast
  with the match id. Creating a match and saving a score each show a success
  toast. The score toast includes that match id.
  A validation failure and a failed initial load also show an error toast.
- Match state is kept in memory after the initial load and resets when the page
  is reloaded. Persistent storage is outside the current exercise scope.

### Changelog

The Changelog tab records each successful match operation in the shared
scoreboard state:

- Match creation stores the new match ID, teams, start time, and the initial
  `0–0` score.
- A score update stores the previous score and the saved score, including a
  save that does not change the numbers.
- Finishing a match stores the status transition from in progress to finished.
  Invalid input, and updates or finishes that do not apply to an active match,
  are not recorded.

Events are appended and shown newest first. When two events share a timestamp,
the later event ID comes first. The date and time are captured when the
operation happens and rendered in `en-GB` as `12 Oct 2026, 10:42:15`. Changelog
entries stay available while navigating between tabs and reset with the rest of
the in-memory scoreboard on reload.

- The match table renders every visible row. Row virtualization is unnecessary
  for the expected matchday size. If the table later holds a large list,
  virtualization can be added without changing the match operations.
- Memoization hooks are used only when there is a concrete need. The match table
  memoizes its column list, and the row-click handler is wrapped in `useCallback`
  inside `useMatchTable`.

## Available Scripts

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start the development server        |
| `npm run build`        | Type-check and build for production |
| `npm run preview`      | Preview the production build        |
| `npm run lint`         | Run ESLint                          |
| `npm run format`       | Format source files with Prettier   |
| `npm run format:check` | Check code formatting               |
| `npm run test`         | Run unit tests once                 |
| `npm run test:watch`   | Run tests in watch mode             |
| `npm run test:e2e`     | Run Playwright E2E tests            |
| `npm run test:e2e:ui`  | Open Playwright UI mode             |

## Technical Stack

- React
- TypeScript
- Vite
- Vitest and React Testing Library
- Playwright
- ESLint and Prettier

## AI Usage

AI-assisted development is documented in [AI.md](./AI.md).

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

### Routing

The application uses hash-based routing so that every view can be opened
directly when deployed to GitHub Pages. The initial views are available at
`#/matches` and `#/finished`.

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

## Technical Stack

- React
- TypeScript
- Vite
- Vitest and React Testing Library
- ESLint and Prettier

## AI Usage

AI-assisted development is documented in [AI.md](./AI.md).

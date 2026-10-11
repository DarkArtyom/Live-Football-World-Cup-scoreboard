# AI Usage Log

## Overview

Cursor Agent was used to bootstrap the project and establish the initial development setup. All implementation decisions were reviewed and refined during the development process.

## AI-Assisted Work

The initial setup included:

- Replacing the default Vite demo with a minimal football scoreboard placeholder.
- Configuring Vitest and React Testing Library with an initial smoke test.
- Setting up Prettier for consistent code formatting.
- Configuring Husky and lint-staged for pre-commit checks.
- Adding a GitHub Actions CI workflow.
- Creating the initial README and project documentation.
- Adding project-specific Cursor rules and a scoreboard implementation skill to preserve the agreed engineering and verification conventions.
- Planning and implementing a mobile-first application shell with hash-based routing, accessible keyboard navigation, and two initial match tabs.
- Deriving a reusable global color system.
- Configuring Playwright with Chromium and adding an initial navigation E2E journey.
- Adding an E2E CI gate, failure artifacts, and persistent testing guidance for future features.

## Workflow

The work followed a plan-first approach: requirements were reviewed, a minimal setup was proposed, and implementation began after the plan was approved. The generated changes were then reviewed and adjusted as needed.

## Feature Implementation

The core match-management feature and its dedicated Git commit are still pending. The Activity log will also be implemented in its own atomic feature commit so its event model, UI, tests, and documentation remain clearly separated.

## Prompt History

The main prompts covered two stages:

1. **Project planning** — reviewing the assignment requirements and deciding on the initial tooling, Git workflow, formatting, testing, and CI setup.
2. **Baseline implementation** — applying the approved setup, replacing the default template, adding an initial test, and documenting the project.
3. **Pre-commit audit** — reviewing dependency reproducibility, Node.js compatibility, quality tooling, CI, documentation, Git status, and the complete baseline diff before the initial commit. Approved findings were then addressed.
4. **Navigation shell** — adapting the routing and tab architecture, using GitHub Pages-compatible hash routing, and adding responsive and accessible navigation tests.
5. **E2E quality gate** — adding Playwright configuration, a browser-level navigation flow, CI enforcement, and guidance that separates unit, component, and E2E responsibilities.

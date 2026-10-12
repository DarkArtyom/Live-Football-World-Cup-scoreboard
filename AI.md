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
- Planning and implementing the core match-management feature, including
  creation, score editing, filtering, ordering, finish confirmation, reusable
  UI components, shared state, and automated tests.

## Workflow

The work followed a plan-first approach: requirements were reviewed, a minimal setup was proposed, and implementation began after the plan was approved. The generated changes were then reviewed and adjusted as needed.

## Feature Implementation

The core match-management feature was implemented through a plan-first
workflow: requirements and edge cases were reviewed, responsibilities were
separated between business operations, shared state, and UI components, and
the completed workflow was verified with unit, component, and end-to-end
tests. Its dedicated Git commit is still pending.

The Changelog tab was implemented as its own feature: history events are
appended from successful match creation, score updates, and match completion
in the shared scoreboard state, then shown newest first.

## Prompt History

The main prompts covered two stages:

1. **Project planning** — reviewing the assignment requirements and deciding on the initial tooling, Git workflow, formatting, testing, and CI setup.
2. **Baseline implementation** — applying the approved setup, replacing the default template, adding an initial test, and documenting the project.
3. **Pre-commit audit** — reviewing dependency reproducibility, Node.js compatibility, quality tooling, CI, documentation, Git status, and the complete baseline diff before the initial commit. Approved findings were then addressed.
4. **Navigation shell** — adapting the routing and tab architecture, using GitHub Pages-compatible hash routing, and adding responsive and accessible navigation tests.
5. **E2E quality gate** — adding Playwright configuration, a browser-level navigation flow, CI enforcement, and guidance that separates unit, component, and E2E responsibilities.
6. **Core match management** — planning and implementing match creation,
   score updates, free-text filtering, summary ordering, finish confirmation,
   the finished-matches view, shared Context state exposed through a custom
   hook, reusable UI components, and unit, component, and E2E coverage.
7. **Match-management follow-up** — improving modal behavior with the native <dialog> element and showModal(), narrowing the Match ID column, centralizing scoreboard action types, and refining row-click handling for editing and finishing matches.
8. **Changelog** — recording match creation, score updates, and match completion in the shared scoreboard state, and showing those events newest first on a third tab. The changelog table defines its columns separately and renders them through a dedicated header, using the same sticky table header as the match tables.
9. **Requirements and Code Review** — The prompt requested a comprehensive review covering memory leaks, unnecessary re-renders, security, test coverage, and E2E tests. The code was reviewed by both AI and a human, followed by manual browser verification of validation, score ordering, search, finish confirmation, the finished matches view, changelog ordering across tabs, reset behavior on page reload, and the sticky changelog header.

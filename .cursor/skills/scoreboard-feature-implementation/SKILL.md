---
name: scoreboard-feature-implementation
description: Implement or modify features in the Live Football World Cup Scoreboard React and TypeScript application. Use when adding or changing match management, score updates, match ordering, validation, UI behavior, or related tests.
---

# Scoreboard Feature Implementation

## 1. Inspect the Existing Project

Before changing code:

- Read the relevant requirements from the assignment and `README.md`.
- Inspect the project structure, `package.json`, and existing Cursor rules.
- Identify the relevant components, types, state management, utilities, and tests.
- Check the existing implementation before deciding what needs to change.
- Identify the smallest reasonable set of changes.

Do not assume that files, libraries, or abstractions exist without checking.

## 2. Clarify the Requirements

Determine:

- What behavior is required?
- Which user actions trigger state changes?
- What validation and boundary cases matter?
- How should matches be ordered after an update?
- What assumptions are not explicitly defined by the assignment?

Follow explicit requirements first. Make reasonable, minimal assumptions when necessary and document meaningful decisions.

## 3. Plan the Implementation

Before coding, provide a concise plan covering:

- Files and components to change.
- Business logic and state updates.
- Tests to add or update.
- Potential edge cases.

Keep the plan proportional to the task. For a small change, use a short plan and proceed without unnecessary ceremony.

## 4. Implement the Feature

- Follow the existing project architecture and coding conventions.
- Prefer the simplest solution that satisfies the requirements.
- Use strict TypeScript types and avoid unjustified `any`.
- Keep business logic separate from JSX when practical.
- Update React state immutably.
- Avoid unnecessary dependencies and abstractions.
- Avoid unrelated refactoring.
- Handle invalid input and relevant edge cases.
- Keep UI behavior consistent with the underlying business rules.

Do not implement extra features that were not requested.

## 5. Add Tests

Use Vitest and React Testing Library according to the existing project setup.
Use Playwright when the change affects a critical user journey across components or routes.

Depending on the feature, verify:

- Expected behavior for valid input.
- Validation and invalid input handling.
- Correct score and match state updates.
- Correct ordering after state changes.
- Empty states and relevant boundary cases.
- User-visible behavior for interactive components.

Prefer focused tests that protect the feature's requirements. Avoid testing implementation details unnecessarily.
Keep pure business rules and focused component edge cases in Vitest. Do not duplicate them in Playwright.
For E2E tests, cover the complete user workflow and prefer accessible role, name, and label selectors.

## 6. Verify the Changes

Run the relevant tests and, when appropriate:

- `npm run test`
- `npm run test:e2e` when the feature changes a user journey
- `npm run lint`
- `npm run format:check`
- `npm run build`

Inspect command output and fix issues caused by the changes.

If a check cannot be run, report that clearly. Never claim a check passed without running it.

## 7. Review the Final Changes

Before finishing:

- Review the diff for unrelated changes and accidental deletions.
- Check for duplicated logic, weak types, and unnecessary complexity.
- Confirm that tests cover the important behavior.
- Update `README.md` if assumptions or trade-offs have changed.
- Update `AI.md` if the AI usage log needs to reflect the work.

Summarize what changed, which checks were run, and any remaining limitations.

Do not create a Git commit unless explicitly requested or required by the current workflow.

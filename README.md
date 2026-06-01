# Playwright BDD Framework with Unified Component and Regression Execution

This project now supports a **BDD-based Playwright framework** that runs **component-level** and **regression** scenarios in one execution flow using **Gherkin feature files**, **shared step definitions**, **reusable components/page objects**, and **environment-driven configuration**.

## Unified BDD workflow

```bash
npm run test:unified
```

Helpful variants:

- `npm run test:component` - runs `@component` scenarios only
- `npm run test:regression` - runs `@regression` scenarios only
- `npm run test:headed` - runs the same generated BDD suite in headed mode

## BDD framework structure

```text
tests/
  features/
    component/
    regression/
  steps/
src/
  bdd/
  components/
  config/
  pages/
```

Key implementation points:

- Feature files live under `tests/features/**/*.feature`
- Step definitions live under `tests/steps/**/*.ts`
- `playwright-bdd` generates runnable Playwright tests before execution
- `playwright.config.ts` now points only to generated BDD tests, so legacy demo specs do not affect the unified suite
- Jira reporter loading is conditional, so clean checkouts do not fail when `dist/utils/jiraReporter.js` has not been built yet
- Execution summary reporting now writes JSON + Markdown metrics for flaky-test tracking and weekly status updates

## Environment configuration

The framework reads configuration from `.env` / environment variables:

- `TEST_ENV` selects `local`, `dev`, `qa`, or `prod`
- `BASE_URL` and per-environment base URLs control the target application
- reusable credential defaults can be supplied for scenario data
- `ENABLE_EXECUTION_SUMMARY` controls the built-in execution summary reporter
- `EXECUTION_SUMMARY_JSON` and `EXECUTION_SUMMARY_MD` control summary output file locations

## Stability enhancements

- Core page interactions now use fallback locator strategies before failing, which makes common flows less brittle when markup or accessibility hooks shift.
- Registration, login, header navigation, and add-to-cart flows now reuse the same resilient interaction layer for clearer diagnostics.

## Execution analytics

Every run can now emit:

- `test-results/execution-summary.json` for machine-readable metrics
- `test-results/execution-summary.md` for status-report and PR-friendly summaries

The summary includes:

- run timing and environment metadata
- pass/fail/flaky totals
- per-project breakdowns
- top tags, slowest tests, and failure details

---

# Playwright Jira Reporter (Auto Bug Creation)

This project includes a **custom Playwright reporter** that automatically creates **Jira Bug tickets** when a test fails.

It supports:
- ✅ Creating Jira tickets for failed tests (with failure context)
- ✅ Preventing duplicates using **Summary + Status + Environment**
- ✅ Creating a new ticket only when needed (based on ticket status & env)
- ✅ Capturing artifacts (screenshots/videos/traces) and attaching to Jira (if enabled in the repo)
- ✅ Logging **clean reproduction steps** using console logs that start with `>` (so steps are filtered easily)

---

## Table of Contents
- [How it works](#how-it-works)
- [Duplicate prevention logic](#duplicate-prevention-logic)
- [Reproduction steps logging rule (`>`)](#reproduction-steps-logging-rule-)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Compile JiraReporter (IMPORTANT)](#compile-jirareporter-important)
- [Run Tests (with and without Jira)](#run-tests-with-and-without-jira)
- [Environment Variables](#environment-variables)
- [Recommended NPM Scripts](#recommended-npm-scripts)
- [Troubleshooting](#troubleshooting)

---

## How it works

When Playwright runs tests:
1. The reporter listens to test lifecycle events.
2. If a test **fails**, it collects:
   - Test title / full test name
   - Error message + stack trace
   - Environment (example: `qa`, `dev`, `prod`)
   - Run metadata (browser/project, timestamp)
   - Artifacts (screenshots/videos/traces) if configured in Playwright
3. It generates a Jira ticket **Summary** and **Description**.
4. It checks Jira for an existing ticket with the same **Summary**.
5. Based on the result, it either:
   - **Creates a new ticket**
   - Or **skips** (duplicate)
   - Or **creates a new ticket** (if previous ticket is Done / or env is different)

---

## Duplicate prevention logic

Duplicate filtering is done using the **Summary**.

### Rule 1: Search by Summary
- The reporter searches Jira using the **exact/normalized Summary** that it generates for the failure.

### Rule 2: If ticket found → check Status
If Jira issue exists with the same Summary:
- If status is **Done** (or any “closed” state configured as done):
  ✅ Create a **new ticket** (because previous one is already closed)
- Else (To Do / In Progress / Open / etc.):
  Continue to Rule 3

### Rule 3: If ticket is not Done → compare Environment
If the found ticket is **not Done**:
- If the **environment is the SAME** as the current run:
  ⛔ Consider it a duplicate → **skip creating**
- If the **environment is DIFFERENT** than the current run:
  ✅ Create a **new ticket** (because same bug happened in a different env)

**Example:**
- Ticket exists: `Login fails - Invalid token` in **QA**, status **In Progress**
- Next run fails in **PROD**
✅ Reporter creates a **new** ticket for PROD.

---

## Reproduction steps logging rule (`>`)

To keep Jira ticket reproduction steps **clean**, the reporter only includes logs that start with:

### ✅ `>`

That means:  
When you print steps to console, always start the step with `>`.

### Example (Correct)
```ts
console.log("> Step 1: Navigate to Login page");
console.log("> Step 2: Enter valid username/password");
console.log("> Step 3: Click Login button");
console.log("> Expected: User should be logged in");
console.log("> Actual: Error message displayed: Invalid token");

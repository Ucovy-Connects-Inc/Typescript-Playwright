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

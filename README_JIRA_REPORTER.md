
# Playwright Jira Reporter

This custom Playwright reporter automates Jira ticket creation for failed tests, with advanced duplicate detection and log filtering.

## Features

- **Automatic Jira bug creation** for failed Playwright tests
- **Environment-based control:** Only creates tickets if `ENABLE_JIRA=true` is set
- **Duplicate detection:**
  - Checks for existing tickets by summary
  - If a ticket is found and status is not `Done`, it skips creating a new ticket
  - If status is `Done`, it creates a new ticket
  - If a ticket is found but the environment (e.g., test environment) is different, it creates a new ticket
  - If the environment is the same, it considers it a duplicate and skips
- **Log filtering for steps to reproduce:** Only console logs starting with `>` are included in the Jira ticket's steps
- **Attaches screenshots, traces, and videos** to the Jira ticket

## How It Works

1. On test failure, the reporter checks for an existing Jira ticket by summary.
2. If a ticket exists:
   - If status is not `Done` and environment is the same, it skips creating a new ticket (duplicate).
   - If status is `Done` or environment is different, it creates a new ticket.
3. If no ticket exists, it creates a new Jira ticket.
4. Only console logs starting with `>` are included as steps to reproduce in the ticket.
5. Attachments (screenshots, traces, videos) are uploaded to the ticket.

## Usage

### 1. Compile the Reporter

Before running tests, compile `jiraReporter.ts` to `./dist/utils/jiraReporter.js`:

```sh
tsc src/utils/jiraReporter.ts --outDir dist/utils --esModuleInterop
```
Or, if you use a build script:

```sh
npm run build
```

### 2. Configure Playwright

In your `playwright.config.ts`, include the reporter only if `ENABLE_JIRA=true`:

```typescript
const enableJiraReporter = process.env.ENABLE_JIRA || 'true';
```

### 3. Run Tests with Jira Reporter Enabled

Set the environment variable and run your tests:

**Windows PowerShell:**

```powershell
$env:ENABLE_JIRA="true"; npx playwright test
```

**Windows CMD:**

```cmd
set ENABLE_JIRA=true && npx playwright test
```

**Linux/macOS:**

```sh
ENABLE_JIRA=true npx playwright test
```

### 4. Steps to Reproduce in Jira Ticket

- Only console logs starting with `>` will be included as steps to reproduce in the Jira ticket.
- Example:

  ```js
  console.info('> Step 1: Go to login page');
  console.info('> Step 2: Enter credentials');
  ```

### 5. Duplicate Ticket Handling

Duplicate filtering is done using the **Summary**.

#### Rule 1: Search by Summary
- The reporter searches Jira using the **exact/normalized Summary** that it generates for the failure.

#### Rule 2: If ticket found → check Status
- If Jira issue exists with the same Summary:
  - If status is **Done** (or any “closed” state configured as done):
    - ✅ Create a **new ticket** (because previous one is already closed)
  - Else (To Do / In Progress / Open / etc.):
    - Continue to Rule 3

#### Rule 3: If ticket is not Done → compare Environment
- If the found ticket is **not Done**:
  - If the **environment is the SAME** as the current run:
    - ⛔ Consider it a duplicate → **skip creating**
  - If the **environment is DIFFERENT** than the current run:
    - ✅ Create a **new ticket** (because same bug happened in a different env)

## Troubleshooting

- Ensure your Jira credentials and project settings are correct in `jiraReporter.ts`.
- Make sure `jiraReporter.ts` is compiled to `./dist/utils/jiraReporter.js` before running tests.
- Check the Playwright and reporter logs for any errors.

## Security

- Do not commit sensitive Jira credentials to version control.
- Use environment variables or a secure vault for secrets in production.

---

For questions or improvements, contact the project maintainer.

# Talentware - Search Colleagues Automation

This project uses Playwright, TypeScript, and Cucumber to test the **Search colleagues** area of the Talentware HR platform.

## User Story

As an employee,
I want to search for a colleague by name or job title and narrow the list with filters,
so that I can quickly find the right person and open their public profile.

## Assumptions

- An Employee can only view colleagues and public profile information; the tests do not create, edit, delete, or message anything.
- Search is case-insensitive and supports partial matches in both name and role.
- Shared test environments can contain changing data. Tests must not depend on the total number of colleagues.
- Reset filters is assumed to clear search text and active filters and restore the unfiltered directory.
- The current examples use known test records from the shared environment. Those names and roles can become unstable unless stable test data is provided.

## Project Structure

- `features/SearchColleagues.feature`: Gherkin scenarios with smoke, regression, boundary, automated, and manual tags.
- `src/steps/`: Cucumber hooks and step definitions.
- `src/pages/LoginPage.ts`: login navigation and credentials.
- `src/pages/SearchColleaguesPage.ts`: search, filters, result count, cards, and pagination.
- `src/pages/EmployeeCardPage.ts`: public profile fields and value locators.
- `src/steps/world.ts`: shared Browser, Context, and Page instances for Cucumber steps.


## Automated and Manual Coverage

Four scenarios are currently tagged for automation:

1. Partial-name search through the Search button.
2. Partial-job-title search through the Search button.
3. Combining text search with a Job title filter and resetting filters.
4. Displaying "No results" when there is no match.


All scenarios, including manual scenarios, remain in `features/SearchColleagues.feature`.

## Tags

- `@automated`: scenarios with implemented Cucumber step definitions.
- `@smoke`: core login and search flows.
- `@regression`: filtering, reset, and no-result behavior.
- `@manual`: scenarios intended for manual or exploratory verification.

Run automated smoke scenarios:

```powershell
npx cucumber-js --tags "@automated and @smoke"
```

Run all automated scenarios:

```powershell
npx cucumber-js --tags "@automated"
```

Run one tag group:

```powershell
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@regression"
```

## Setup

Requirements:

- Node.js 20 or newer
- npm
- Access to a Talentware test environment

Install dependencies and Chromium:

```powershell
npm ci
npx playwright install --with-deps chromium
```

Copy the environment template:

```powershell
Copy-Item .env.example .env
```

Set these values in `.env`:

```text
BASE_URL=<Talentware environment URL>
TEST_USER_EMAIL=<Employee test account email>
TEST_USER_PASSWORD=<Employee test account password>
```

The test URL, username, and password are loaded as environment variables. Real credentials must never be committed to the repository or Gherkin files.

`BASE_URL` supports multiple environments:

- Test: `https://app.test.talentware.ai`
- Placeholder or staging: set `BASE_URL` to another environment URL before running the tests.

The `.env` file is excluded by `.gitignore`.


The Cucumber HTML report is written to `test-results/cucumber-report.html`. Playwright traces are saved under `test-results/traces/`.

Open a trace with:

```powershell
npx playwright show-trace test-results/traces/<trace-file>.zip
```

## CI

GitHub Actions workflow `.github/workflows/cucumber-tests.yml` runs on push, pull request, and manual dispatch. It installs dependencies and Chromium, runs `@automated` scenarios, and uploads the Cucumber report and trace artifacts.

Configure these repository secrets in **Settings > Secrets and variables > Actions**:

- `BASE_URL`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

## Selector Strategy

Prefer user-facing selectors such as roles, placeholder text, headings, accessible names, and visible text. Search uses the Name or role placeholder, while navigation, buttons, and profile fields use accessible roles or visible labels.

The easiest elements to locate are the navigation link, login form, Search button, search field, and profile labels. Result cards and counters occasionally require relative or structural locators because the shared UI does not expose stable test IDs for every element.

For long-term maintainability, the frontend team should add stable `data-testid` attributes or improved accessible names to core controls. Tests should avoid deep CSS paths, fixed element positions, and selectors tied to visual styling.

## AI-Assisted Development

I used GitHub Copilot in VS Code for requirement analysis, Test cases generation with prompt, Page Objects, and step implementation. I guided it with specific constraints: preserve existing behavior, use environment variables, keep credentials out of source control, and prefer semantic Playwright locators. I reviewed the generated code against the actual application and manually corrected field labels, counter validation, error handling, and shared locator logic. I discarded suggestions that relied on deep DOM indexes, hard-coded full result sets, and credentials in code.

## Known Limitations

1. **Shared test data is not isolated.** Specific names and roles can change. The test-data or backend team should provide stable seeded records or a dedicated test tenant.
2. **Some UI controls lack stable test attributes.** Filtering, sorting, and counting rely partly on visible text and DOM structure. Frontend engineers should add stable test IDs or accessible names for these controls.
3. **CI coverage is limited.** The suite mainly runs Chromium and has no separate API-level check. A broader browser matrix and API validation should be agreed with the frontend and backend teams, based on CI cost and environment stability.

# Open Questions

Please confirm the expected behavior for the following cases:

1. **Reset filters**
   The current assumption is that resetting clears the search and all filters, returns to the unfiltered directory, and returns pagination to the first page. Should it also reset sorting?

2. **Sort order**
   Should colleagues be sorted by first name, surname, or role? The current behavior appears to sort by surname.

3. **Sorting ties**
   When colleagues have the same first and last name, should role be used as a tie-breaker? The current behavior does not appear to use one.

4. **Pagination**
   Should changing filters or sort order return the results to the first page?

# Automation Exercise – Login Automation (Playwright + TypeScript)

Automated UI test for the login flow on [automationexercise.com](https://www.automationexercise.com/), written with [Playwright Test](https://playwright.dev/) and TypeScript using the Page Object Model.

## Scenario covered

| # | Step | How it is checked |
|---|------|-------------------|
| 1 | Launch the website | Home page opens and the title contains "Automation Exercise" |
| 2 | Navigate to the Login page | "Signup / Login" is clicked; URL is `/login` and "Login to your account" is visible |
| 3 | Enter the registered email and password | Filled from environment variables (never hard-coded) |
| 4 | Submit the login form | "Login" button is clicked |
| 5 | Verify that the login was successful | Header shows **"Logged in as &lt;name&gt;"**, a **Logout** link is visible, the URL has left `/login`, and no error message is shown |

An extra negative test checks that a wrong password is rejected with *"Your email or password is incorrect!"* and the user stays logged out.

The test account was created manually on the website before the automation was written, as the assignment requires.

## Project structure

```
├── pages/
│   ├── BasePage.ts        # shared helpers: ad blocking, consent dialog
│   ├── HomePage.ts        # home page locators and login-state assertions
│   └── LoginPage.ts       # login form locators and actions
├── tests/
│   └── login.spec.ts      # test cases
├── utils/
│   └── env.ts             # loads and validates credentials from .env
├── playwright.config.ts   # browser, timeouts, reporters, traces
├── .env.example           # template for credentials
└── .github/workflows/     # CI pipeline (GitHub Actions)
```

## Setup

Requires Node.js 18 or later.

```bash
npm install
npx playwright install chromium
cp .env.example .env      # then put your registered email, password and account name in .env
```

`.env` is listed in `.gitignore`, so credentials are never committed.

## Run

```bash
npm test               # headless run
npm run test:headed    # watch the browser
npm run report         # open the HTML report of the last run
npm run typecheck      # TypeScript check
```

On failure, Playwright keeps a screenshot, a video and a trace (`npx playwright show-trace <trace.zip>`) in `test-results/`.

## Design notes

- **Page Object Model** keeps locators and actions out of the test, so a UI change is fixed in one place.
- **Stable locators**: the login form uses the site's `data-qa` attributes; other elements use accessible roles and text.
- **Ad blocking**: the site loads many third-party ads that slow it down and can overlap elements, so ad domains are blocked with `page.route`.
- **Consent dialog**: a cookie-consent popup that appears in some regions is dismissed if present.
- **Credentials** come from environment variables and are validated at start-up with a clear error if missing.

## CI

`.github/workflows/playwright.yml` runs the suite on every push and pull request to `main`, and uploads the HTML report as an artifact. Add these repository secrets under *Settings → Secrets and variables → Actions*: `USER_EMAIL`, `USER_PASSWORD`, `USER_NAME`.

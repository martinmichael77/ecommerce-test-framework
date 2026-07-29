# E-Commerce Test Automation Framework

A full-stack test automation framework demonstrating SDET-level skills: UI automation, API automation, hybrid (UI+API) testing, CI/CD integration, performance/load testing, and containerization.

Built against [automationexercise.com](https://www.automationexercise.com), a public e-commerce demo site, with a self-hosted mock API service for safe, reproducible load testing.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Automation | Playwright (TypeScript), Page Object Model |
| API Automation | Playwright API testing module |
| Test Runner | Playwright Test Runner |
| CI/CD | GitHub Actions |
| Load Testing | k6 |
| Containerization | Docker + Docker Compose |
| Mock API | Node.js + Express |

---

## Project Structure

```
ecommerce-test-framework/
├── src/
│   ├── pages/              # Page Object classes (BasePage, HomePage, LoginPage)
│   ├── api/                # API client and service classes (ApiClient, ProductsApi)
│   ├── fixtures/           # Custom Playwright fixtures
│   └── utils/              # Helpers, test data generators
├── tests/
│   ├── ui/                 # UI test specs
│   ├── api/                # API test specs
│   └── hybrid/             # Combined UI + API consistency tests
├── load-tests/
│   ├── products-load-test.js   # k6 load test script
│   └── mock-server/
│       ├── server.js            # Express mock API for load testing
│       └── Dockerfile
├── .github/workflows/
│   └── playwright.yml      # CI pipeline: UI, API, and hybrid suites
├── Dockerfile               # Test runner image (Playwright)
├── docker-compose.yml        # Orchestrates mock-api + test-runner
├── playwright.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- Docker Desktop (for containerized runs)
- k6 (for local load testing outside Docker)

### Install and run locally

```bash
npm install
npx playwright install

# Run all tests
npx playwright test

# Run individual suites
npx playwright test tests/ui
npx playwright test tests/api
npx playwright test tests/hybrid

# View the HTML report
npx playwright show-report
```

### Run the full stack with Docker Compose

```bash
docker compose up --build --abort-on-container-exit
docker compose down
```

This builds and runs two services:
- **mock-api** — an Express server simulating a product catalog endpoint
- **test-runner** — a Playwright container that waits for `mock-api` to be healthy, then executes the full test suite against it

### Run the load test

**Locally (mock server running on your machine):**
```bash
node load-tests/mock-server/server.js
# in a second terminal
k6 run load-tests/products-load-test.js
```

**Against Docker's internal network**, the script reads `MOCK_API_URL` from the environment and defaults to `http://localhost:4000` otherwise.

---

## What Each Layer Demonstrates

### UI Automation
Page Object Model design (`BasePage` → `HomePage`, `LoginPage`) covering login and navigation flows, using resilient locators (attribute-based and role-based) rather than brittle text/CSS matches.

### API Automation
Tests against automationexercise.com's public products API, covering status codes, response schema validation, and both positive and negative search cases.

### Hybrid Testing
The layer that most directly reflects real SDET work: using the API to confirm data exists, then verifying the same data is correctly reflected in the UI — e.g., confirming a product returned by an API search also appears in the UI search results, and that product counts are consistent between the two.

### CI/CD
GitHub Actions runs the UI, API, and hybrid suites as separate steps on every push and pull request to `main`, with the HTML report uploaded as a downloadable artifact regardless of pass/fail.

### Load Testing
A k6 script ramps virtual users from 20 to 50 against a product-catalog endpoint, asserting on both correctness (response shape) and performance thresholds (p95 latency under 2s, error rate under 5%).

### Containerization
A multi-service Docker Compose setup — a Playwright test-runner container and an Express mock-api container — wired together with a healthcheck so tests only start once the API is confirmed ready.

---

## Real-World Problems Solved Along the Way

This project intentionally documents the debugging process, not just the final green checkmarks — these are the kinds of judgment calls and troubleshooting an SDET does daily.

**1. Form-encoded vs. JSON API payloads**
The `/api/searchProduct` endpoint expected `application/x-www-form-urlencoded` data, not JSON. Diagnosed by logging the raw response body, then fixed by adding a dedicated `postForm()` method to the API client rather than forcing JSON globally.

**2. Slow third-party page loads**
`page.goto()` was timing out waiting for the `load` event on a real-world site with slow third-party scripts. Switched to `waitUntil: 'domcontentloaded'` with an extended timeout — the correct strategy when testing sites you don't control.

**3. Bot-protection blocking load tests**
Initial load testing directly against automationexercise.com's API returned an explicit `Imunify360` bot-protection block, even after adjusting request headers to mimic a browser. Rather than attempting to evade a third party's security controls, the load test target was pivoted to a self-hosted Express mock service — a more realistic approach anyway, since production load testing should target infrastructure you own or a staging environment, not a third party's live site.

**4. Docker image version mismatch**
Playwright's Docker image tag must exactly match the installed `@playwright/test` npm version — a mismatch (`v1.49.0-noble` image vs. `1.62.0` npm package) caused browser launch failures inside the container. Fixed by pinning the Dockerfile's base image to match `package.json` exactly. This is a common gotcha worth remembering any time `@playwright/test` is upgraded.

---

## Possible Future Additions
- Visual regression testing (Playwright screenshots or Applitools)
- Cross-browser matrix in CI (Firefox, WebKit alongside Chromium)
- Allure reporting integration
- API contract testing (e.g., with Pact or JSON schema validation)
- Mobile web viewport testing
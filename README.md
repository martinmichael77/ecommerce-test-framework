# E-Commerce Test Automation Framework

A full-stack test automation framework demonstrating SDET-level engineering practices across **UI automation, API automation, hybrid testing, database validation, API-to-database integration testing, CI/CD, performance testing, and containerization**.

Built against [automationexercise.com](https://www.automationexercise.com), a public e-commerce demo site, with a self-hosted Product API and mock API services for controlled integration and performance testing.

The framework is designed to demonstrate how an SDET can validate a system across multiple layers rather than treating UI automation as the only testing surface.

---

## Tech Stack

| Layer                  | Technology                 |
| ---------------------- | -------------------------- |
| UI Automation          | Playwright + TypeScript    |
| UI Design Pattern      | Page Object Model          |
| API Automation         | Playwright APIRequest      |
| API Service            | Node.js + Express          |
| Database               | PostgreSQL 16              |
| Database Access        | `pg` / node-postgres       |
| Test Fixtures          | Playwright Custom Fixtures |
| Test Runner            | Playwright Test Runner     |
| CI/CD                  | GitHub Actions             |
| Load Testing           | k6                         |
| Containerization       | Docker + Docker Compose    |
| Mock API               | Node.js + Express          |
| Environment Management | dotenv                     |

---

## Architecture

The framework validates the application at multiple layers:

```text
                    E-Commerce System
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
            UI            API          Database
             │             │             │
        Playwright    Playwright API   PostgreSQL
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                  Integration Testing
                           │
                           ▼
                     CI / GitHub
```

### Test flow

```text
UI Tests
   │
   └── Validate user-facing behaviour

API Tests
   │
   └── Validate backend endpoints

Hybrid Tests
   │
   └── API data ↔ UI data consistency

Database Tests
   │
   └── Validate persisted data directly

Integration Tests
   │
   └── API → PostgreSQL persistence

CI/CD
   │
   └── Execute the complete test suite automatically
```

---

## Project Structure

```text
ecommerce-test-framework/
├── src/
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   └── LoginPage.ts
│   │
│   ├── api/
│   │   ├── ApiClient.ts
│   │   └── ProductsApi.ts
│   │
│   ├── db/
│   │   ├── DatabaseClient.ts
│   │   ├── DatabaseSeeder.ts
│   │   └── schema.sql
│   │
│   ├── fixtures/
│   │   └── database.fixture.ts
│   │
│   ├── server/
│   │   ├── ProductServer.ts
│   │   └── server.ts
│   │
│   └── utils/
│       └── # Shared utilities
│
├── tests/
│   ├── ui/
│   │   └── Login.spec.ts
│   │
│   ├── api/
│   │   └── products.spec.ts
│   │
│   ├── hybrid/
│   │   └── product-search.spec.ts
│   │
│   ├── db/
│   │   └── database.spec.ts
│   │
│   └── integration/
│       └── product-api-db.spec.ts
│
├── load-tests/
│   ├── products-load-test.js
│   └── mock-server/
│       ├── server.js
│       └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── Dockerfile
├── docker-compose.yml
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js 20+
* Docker Desktop
* k6 — required only for local performance testing
* Git

### Install dependencies

```bash
npm install
npx playwright install
```

### Environment configuration

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_test
DB_USER=test_user
DB_PASSWORD=test_password
API_PORT=3000
```

> `.env` is excluded from Git through `.gitignore`. Do not commit credentials or environment-specific secrets.

---

## Run the PostgreSQL Database

Start PostgreSQL using Docker Compose:

```bash
docker compose up -d postgres
```

The PostgreSQL service runs on:

```text
localhost:5432
```

The database is:

```text
ecommerce_test
```

The database schema is defined in:

```text
src/db/schema.sql
```

---

## Start the Product API

The project includes a lightweight Express Product API specifically for API-to-database integration testing.

Start it with:

```bash
npm run start:api
```

The API runs on:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

---

## Run Tests Locally

### Run the complete suite

```bash
npx playwright test
```

### Run UI tests

```bash
npx playwright test ui
```

### Run API tests

```bash
npx playwright test api
```

### Run hybrid tests

```bash
npx playwright test hybrid
```

### Run database tests

```bash
npx playwright test db
```

### Run API → Database integration tests

```bash
npx playwright test integration
```

### View the HTML report

```bash
npx playwright show-report
```

---

# Test Coverage

The framework currently contains **10 automated tests across five testing layers**.

```text
UI                  → 2 tests
API                 → 4 tests
Hybrid              → 2 tests
Database            → 1 test
API → Database      → 1 test
                       ─────
                       10 tests
```

---

## UI Automation

UI tests use the **Page Object Model** to separate page interaction logic from test scenarios.

Current coverage includes:

* Login page navigation
* Invalid login validation
* Reusable page objects
* Resilient role/attribute-based locators

Architecture:

```text
Test
 │
 ▼
LoginPage
 │
 ▼
BasePage
 │
 ▼
Playwright Browser
```

---

## API Automation

API tests use Playwright's API testing capabilities against the public Automation Exercise product API.

Current coverage includes:

* GET product listing
* Response status validation
* Product response schema validation
* Product search
* Empty search negative case
* Form-encoded API requests

The framework uses a reusable API client:

```text
ProductsApi
     │
     ▼
ApiClient
     │
     ▼
HTTP API
```

This keeps HTTP implementation details centralized instead of duplicating request logic across tests.

---

## Hybrid Testing

Hybrid tests validate consistency between backend API responses and the UI.

Example:

```text
API Search
    │
    ▼
Product returned
    │
    ▼
UI Search
    │
    ▼
Product displayed
```

Current scenarios include:

* Product returned by API search also appears in UI
* Product count returned by API matches the count displayed in UI

This demonstrates validation across multiple system layers rather than testing each layer independently.

---

# Database Testing

PostgreSQL has been added as a dedicated test database.

The database layer contains:

```text
DatabaseClient
     │
     ▼
PostgreSQL
     │
     ▼
products table
```

### Database schema

The `products` table contains:

* `id`
* `name`
* `price`
* `brand`
* `category`
* `created_at`

Schema:

```text
src/db/schema.sql
```

### Database client

`DatabaseClient` provides a reusable PostgreSQL connection pool using `pg`.

Responsibilities include:

* Connection management
* Parameterized SQL queries
* Result handling
* Connection cleanup

---

# Database Fixtures & Test Isolation

Database test data is managed through reusable fixture/seeding logic rather than embedding setup SQL directly into every test.

The framework uses:

```text
DatabaseSeeder
      │
      ├── Seed known test products
      │
      └── Remove only test-owned fixture data
```

Instead of using a global:

```sql
TRUNCATE TABLE products;
```

the database tests clean up only the records they own.

This allows database-dependent tests to execute without unnecessarily destroying data created by another test.

### Why this matters

With Playwright running multiple workers:

```text
Worker 1 → Database test
Worker 2 → Integration test
```

tests should not interfere with each other's data.

This is an important consideration when scaling a test suite from local execution to CI environments.

---

# API → Database Integration Testing

The framework includes an integration test validating the complete persistence flow:

```text
POST /api/products
        │
        ▼
Express Product API
        │
        ▼
PostgreSQL INSERT
        │
        ▼
Database record
        │
        ▼
Playwright SQL validation
```

The test:

1. Creates a product through the API.
2. Validates the API response.
3. Extracts the generated product ID.
4. Queries PostgreSQL using that ID.
5. Validates the persisted database record.
6. Deletes the test-created record.

Example validation:

```text
API response
     │
     ├── name
     ├── price
     ├── brand
     └── category
          │
          ▼
PostgreSQL
     │
     ├── name
     ├── price
     ├── brand
     └── category
```

This verifies that the API is not only returning a successful response but is actually persisting the expected data.

---

# CI/CD

GitHub Actions executes the automated test suite in a clean CI environment.

The pipeline provisions PostgreSQL as a GitHub Actions service container and initializes the database schema before running the tests.

CI flow:

```text
Git Push / Pull Request
          │
          ▼
     GitHub Actions
          │
          ├── Checkout
          ├── Node.js 20
          ├── npm ci
          ├── Playwright browsers
          ├── PostgreSQL client
          ├── Database schema
          ├── Product API
          ├── API health check
          │
          ▼
     Playwright Tests
          │
          ├── UI
          ├── API
          ├── Hybrid
          ├── Database
          └── Integration
          │
          ▼
     Test Reports
```

The pipeline also uploads:

* Playwright HTML report
* Product API logs

as GitHub Actions artifacts.

This provides failure diagnostics without requiring the test suite to be reproduced locally.

---

# Performance Testing

Performance testing is implemented using **k6** against a self-hosted mock product API.

The load test:

* Ramps virtual users from 20 to 50
* Validates response correctness
* Measures response latency
* Checks error rate

Current thresholds:

```text
p95 response time < 2 seconds
Error rate         < 5%
```

The mock API is intentionally self-hosted because load testing against a public third-party production service is neither reliable nor appropriate.

---

# Containerization

Docker Compose provides the infrastructure required for local integration testing.

Current services include:

```text
Docker Compose
     │
     ├── PostgreSQL
     │
     ├── Mock API
     │
     └── Playwright Test Runner
```

PostgreSQL provides the database used by the integration tests.

The mock API provides a controlled target for performance testing.

The Playwright test runner provides a reproducible browser execution environment.

Run the stack with:

```bash
docker compose up --build --abort-on-container-exit
```

Stop the stack:

```bash
docker compose down
```

---

# Real-World Problems Solved Along the Way

This project intentionally documents debugging decisions and engineering trade-offs rather than only showing successful test runs.

## 1. Form-encoded vs JSON API payloads

The `/api/searchProduct` endpoint expected:

```text
application/x-www-form-urlencoded
```

rather than JSON.

The issue was diagnosed by inspecting the raw response and was solved by adding a dedicated `postForm()` method to the API client instead of changing the default behaviour for all API requests.

---

## 2. Slow third-party page loads

`page.goto()` was timing out while waiting for the `load` event because of slow third-party scripts.

The framework was changed to use:

```text
waitUntil: 'domcontentloaded'
```

with an extended timeout.

This avoids unnecessarily waiting for unrelated third-party resources when validating the page itself.

---

## 3. Bot protection during load testing

Direct load testing against the public Automation Exercise API triggered third-party bot protection.

Instead of attempting to bypass the security controls, the performance test target was changed to a self-hosted Express mock API.

This provides:

* Controlled infrastructure
* Reproducible results
* Safe load testing
* No third-party production impact

---

## 4. Playwright Docker version mismatch

A mismatch between the Playwright Docker image version and the installed `@playwright/test` version caused browser launch failures inside Docker.

The issue was resolved by keeping the Docker Playwright version aligned with the npm package version.

---

## 5. Database test isolation

Database tests initially used:

```sql
TRUNCATE TABLE products RESTART IDENTITY;
```

This could interfere with other database-dependent tests running concurrently.

The test-data strategy was changed to use test-owned fixture data and targeted cleanup.

This makes the database layer safer for parallel Playwright execution.

---

# Current Test Architecture

The current framework can be viewed as five complementary test layers:

```text
                    ┌─────────────────┐
                    │   UI Testing    │
                    │   Playwright    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  API Testing    │
                    │ Playwright API  │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │ Hybrid Testing  │       │ Database Testing│
       │ API ↔ UI        │       │   PostgreSQL    │
       └────────┬────────┘       └────────┬────────┘
                │                         │
                └────────────┬────────────┘
                             ▼
                    ┌─────────────────┐
                    │   Integration   │
                    │    API → DB     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   CI / Docker   │
                    └─────────────────┘
```

---

# Future Roadmap

The next planned capabilities are:

### Phase 3 — API Contract Testing

* OpenAPI specification
* Response contract validation
* Request contract validation
* Negative contract scenarios
* Contract checks in CI

### Phase 4 — Advanced Test Engineering

* Cross-browser CI matrix
* Visual regression testing
* Accessibility testing
* Improved reporting
* Better test-data generation
* Advanced API validation

### Phase 5 — Performance & Reliability

* Expanded k6 scenarios
* Performance regression thresholds
* CI performance gates
* Failure diagnostics
* Test execution metrics

### Phase 6 — AI / MCP QA Engineering

* MCP-based QA tooling
* Automated test analysis
* AI-assisted failure diagnosis
* Test generation from API specifications
* Intelligent test execution workflows

---

# Engineering Principles

This project follows several principles:

* **Reusable over duplicated**
* **API and DB validation beyond UI**
* **Test data isolation**
* **Deterministic test environments**
* **Parameterized SQL queries**
* **Environment-based configuration**
* **CI reproducibility**
* **Controlled performance testing**
* **Failure diagnostics**
* **Incremental engineering improvements**

The goal is not simply to automate test cases, but to demonstrate how an SDET designs and maintains a scalable automation system.

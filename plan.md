# Feature Plan — CI/CD: dev-gated tests + auto-PR to main

> **Branch:** `fix-CI-CD-weaknesses`
> **Goal:** Every PR merged into `dev` triggers automated tests; if they pass, a PR from `dev` → `main` is opened automatically. (Restricting `main` to only accept PRs from `dev` is a separate, later piece — not in this pass.)

---

## Context

Source of truth for tooling: repo-root `ci cd.md` — stack is React/Express + npm, tests are **Jest (unit) + Playwright (e2e)**, deploy is the existing SSH GitHub Action (`.github/workflows/publish.yml`, triggers on push to `main`).

Current state: no test infrastructure exists anywhere in the repo.
- `backend/package.json` → `"test": "echo \"Error: no test specified\" && exit 1"` (hard-fails every run)
- `frontend/package.json` → no `test` script at all
- No Jest/Playwright config, no `*.test.js` files, no `__tests__` dirs

Decision: scaffold a **minimal real Jest setup now** (trivial but genuine passing tests) in both backend and frontend so the new CI gate is green from day one, rather than wiring a workflow that fails on every push. Playwright e2e is out of scope for this pass — it needs the full stack (DB, backend, frontend) running in CI, which is a bigger lift; real Jest unit tests can be filled in incrementally by whoever owns each module.

---

## Steps

### 1. Backend — minimal Jest setup
- `npm install --save-dev jest` in `backend/`
- Replace `test` script with `jest`
- Add one real trivial test (e.g. a pure function already in the codebase, or a smoke test asserting the app module loads) under `backend/src/**/__tests__/` or `*.test.js` — not a placeholder `expect(true).toBe(true)`

### 2. Frontend — minimal Jest setup
- `npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom babel-jest @babel/preset-env @babel/preset-react`
- Add `babel.config.cjs` (Vite doesn't need Babel, but Jest does for JSX transform) and `jest.config.cjs` (jsdom environment)
- Add `"test": "jest"` script
- Add one real trivial test (render a simple existing component, or a pure util function test)

### 3. Workflow — `test-on-dev.yml`
- Trigger: `push: branches: [dev]` (fires after a PR merges into `dev`)
- Jobs: `backend-tests` (`npm ci && npm test` in `backend/`), `frontend-tests` (`npm ci && npm test` in `frontend/`)

### 4. Workflow — auto-PR `dev` → `main`
- Same workflow file (job depends on both test jobs succeeding) or a follow-up job
- Uses `gh pr create --base main --head dev` with `GITHUB_TOKEN`
- Idempotent: check `gh pr list --base main --head dev --state open` first, skip creation if one already exists
- Title/body auto-filled (e.g. list of commits since last sync, or a fixed template)

---

## Verification

- `npm test` passes locally in both `backend/` and `frontend/` before pushing
- Push a trivial commit to `dev` (or merge a test PR into `dev`) and confirm in GitHub Actions: both test jobs run and pass, then the auto-PR to `main` appears
- Push a second time while the `dev → main` PR is still open — confirm no duplicate PR is created
- Break a test intentionally, push to `dev`, confirm the auto-PR step is skipped (job dependency prevents it)

---

## Implementation Order

- [x] Step 1 — backend Jest scaffold
- [x] Step 2 — frontend Jest scaffold
- [x] Step 3 — `test-on-dev.yml` workflow
- [x] Step 4 — auto-PR `dev → main` job
- [x] Step 5 — Swagger
- [ ] Step 6 — Gitleaks
- [ ] Step 7 — Trivy
- [ ] Step 8 — CodeQL
- [ ] Step 9 — npm audit
- [ ] Step 10 — Dependabot

Working step by step with a check-in after each one — waiting for "next" before advancing.

---

## Phase 2 — Docs & security scanning (from `ci cd.md`)

### 5. Swagger (API docs)
- `swagger-jsdoc` + `swagger-ui-express` in `backend/`
- `backend/src/config/swagger.js` — OpenAPI 3.0 spec, scans route files for `@swagger` JSDoc comments
- Mount at `/api-docs` in `server.js`
- Annotate `auth.routes.js` (login/changePassword/logout) as the real first example — other modules documented incrementally later

### 6. Gitleaks
- GitHub Action workflow, runs on push/PR, scans for committed secrets

### 7. Trivy
- GitHub Action workflow, scans filesystem/deps (and Docker images, given `Dockerfile.prod` exists) for vulnerabilities

### 8. CodeQL
- GitHub's default CodeQL setup for JS/TS, scheduled + on PR

### 9. npm audit
- CI step running `npm audit` for backend and frontend (decide fail-threshold, e.g. high/critical only)

### 10. Dependabot
- `.github/dependabot.yml` — version updates for npm (backend, frontend) and github-actions

---

## Deferred (not in this pass)

- Restricting `main` to only accept PRs whose head is `dev` (guard workflow + branch protection settings)
- Playwright e2e suite
- PostHog / Lighthouse / Prometheus + Grafana observability stack

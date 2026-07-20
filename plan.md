# Feature Plan — Lighthouse CI

> **Branch:** `add-lighthouse-ci`
> **Goal:** Add a Lighthouse audit (performance/accessibility/best-practices/SEO) as a CI report on the frontend, per `ci cd.md`'s "mesure" column.

---

## Context

Previous CI/CD phase (Jest, `test-on-dev.yml`, auto-PR to `main`, Swagger, Gitleaks) is done — merged into `dev` and `main`. This is a separate, smaller follow-up.

Of the three "mesure" tools listed in `ci cd.md` (PostHog / Lighthouse / Prometheus + Grafana), Lighthouse is the easiest: a GitHub Action step, no new infrastructure, no signup. PostHog and Prometheus+Grafana remain deferred.

## Steps

### 1. Workflow — `lighthouse.yml`
- Trigger: on push/PR touching `frontend/`, or reuse `test-on-dev.yml`'s trigger (`push: branches: [dev]`) — decide which fits better once scoped
- Build the frontend (`npm run build` in `frontend/`)
- Run `treosh/lighthouse-ci-action` against the built output (static `dist/` via its built-in server, since there's no live deployed URL to hit in CI)
- Report scores as a CI check / PR comment (action supports both)

## Verification
- Push to the branch, confirm the workflow runs and produces a Lighthouse report with real scores (not a hard failure from missing config)

## Implementation Order
- [x] Step 1 — `lighthouse.yml` workflow

Working step by step with a check-in after each one.

---

## Deferred (not in this pass)
- Restricting `main` to only accept PRs whose head is `dev`
- Playwright e2e suite
- PostHog / Prometheus + Grafana

# Feature Plan — Guard: main only accepts PRs from dev

> **Branch:** `guard-main-from-dev`
> **Goal:** Block any PR into `main` whose head branch isn't `dev`. This is the item deferred at the very start of the CI/CD work.

---

## Context

GitHub has no native "restrict PR source branch" setting. It has to be built from two pieces: a workflow that checks `github.head_ref` and fails if it isn't `dev`, plus a branch protection rule on `main` that requires that check to pass before merging.

Known tradeoff: this workflow must trigger on `pull_request: branches: [main]`. The legitimate `Promote dev to main` PR is opened by `github-actions[bot]`, which — as seen repeatedly with Gitleaks/SonarCloud/Lighthouse this session — means it needs a manual "Approve and run" click each time before the check can run. A rogue PR from any other branch, opened by a human, runs automatically (no click) and fails immediately, blocking the merge — which is the actual point of this guard.

## Steps

### 1. Workflow — `guard-main.yml`
- Trigger: `pull_request: branches: [main]`
- Single job/step: compare `github.head_ref` to `dev`, fail with a clear error if it doesn't match

### 2. Branch protection on `main` (manual, GitHub Settings — or via `gh api` if you want me to do it)
- Require status checks to pass before merging → add this guard job
- Consider "Do not allow bypassing the above settings" so it also applies to admins

## Verification
- Open a test PR from some branch other than `dev` into `main` → confirm the check fails and the merge button is blocked
- Confirm the real `Promote dev to main` PR still works once approved and merges cleanly

## Implementation Order
- [x] Step 1 — `guard-main.yml` workflow
- [ ] Step 2 — branch protection rule on `main`

---

## Deferred (not in this pass)
- Playwright e2e suite
- PostHog / Prometheus + Grafana

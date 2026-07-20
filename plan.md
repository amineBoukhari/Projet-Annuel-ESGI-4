# Feature Plan — SonarCloud

> **Branch:** `add-sonarcloud`
> **Goal:** Static code analysis (bugs, code smells, vulnerabilities, duplication, coverage) via SonarCloud, free tier (this repo is public).

---

## Context

SonarCloud is SonarSource's hosted SaaS — free/unlimited for public repos, no infrastructure to run. It needs a one-time account/repo link that only you can do (GitHub login), which I can't perform for you.

## Steps

### 0. Manual setup (you do this, then hand me the two values it gives you)
- Go to sonarcloud.io → "Sign up with GitHub" → import `amineBoukhari/Projet-Annuel-ESGI-4`
- This gives you an **Organization key** and a **Project key** (usually `amineboukhari` / `amineBoukhari_Projet-Annuel-ESGI-4` by default, but confirm the exact values shown)
- Generate a token: My Account → Security → Generate token
- Add it as a repo secret named `SONAR_TOKEN`: Settings → Secrets and variables → Actions → New repository secret

### 1. `sonar-project.properties` (repo root)
- `sonar.organization`, `sonar.projectKey` (from step 0)
- `sonar.sources` scoped to `backend/src` and `frontend/src` (exclude `node_modules`, `dist`, `**/__tests__/**` from source but keep as test paths)
- `sonar.tests` pointing at the `__tests__` dirs already created for Jest

### 2. Workflow — `sonarcloud.yml`
- Trigger: `push` (no `pull_request` — same lesson learned from Gitleaks: the bot-authored `dev → main` PR hits GitHub's workflow-approval gate on `pull_request` events, so push-only avoids that friction)
- `SonarSource/sonarqube-scan-action` with `SONAR_TOKEN` + `GITHUB_TOKEN`
- Runs independently, not wired into `auto-pr-to-main`'s `needs:` (same tier as Lighthouse — advisory, not a merge gate, at least initially)

## Verification
- Push to a branch, confirm the SonarCloud analysis appears on sonarcloud.io with real findings (not a connection/auth error)

## Implementation Order
- [x] Step 0 — you: SonarCloud account + repo link + `SONAR_TOKEN` secret (in `Deploy` environment, not a plain repo secret)
- [x] Step 1 — `sonar-project.properties`
- [x] Step 2 — `sonarcloud.yml` workflow

---

## Deferred (not in this pass)
- Restricting `main` to only accept PRs whose head is `dev`
- Playwright e2e suite
- PostHog / Prometheus + Grafana
- Making SonarCloud a required merge gate (revisit once it's been running clean for a while)

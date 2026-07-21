<!-- doctype markdown -->
<title>CI/CD Pipeline</title>

# CI/CD Pipeline

Two long-lived branches — `dev` (pre-prod) and `main` (prod) — connected by an automated promotion path. Everything below reflects what's actually configured in `.github/workflows/`, not an aspirational version.

```mermaid
flowchart TD
    classDef branch fill:#1f6feb,stroke:#1f6feb,color:#fff,font-weight:bold
    classDef gate fill:#8250df,stroke:#6639ba,color:#fff
    classDef advisory fill:#57606a,stroke:#424a53,color:#fff
    classDef deploy fill:#cf222e,stroke:#a40e26,color:#fff
    classDef stop fill:none,stroke:#cf222e,color:#cf222e,stroke-dasharray: 3 3

    FEAT["Feature branch\ncommits"]
    FEAT -->|"PR"| PRDEV{{"PR into dev"}}

    subgraph DEVCHECKS[" "]
        direction LR
        LH["Lighthouse\nperf / a11y / seo"]:::advisory
        SC1["SonarCloud\ncode quality + coverage"]:::advisory
    end

    PRDEV --> DEVCHECKS
    DEVCHECKS -->|"merge"| DEV(("dev")):::branch

    DEV -->|"push"| TOD{{"Test on dev"}}

    subgraph TODJOBS[" "]
        direction LR
        BT["backend-tests\nJest"]:::gate
        FT["frontend-tests\nJest"]:::gate
        GL["gitleaks\nsecret scan"]:::gate
    end

    TOD --> TODJOBS
    TODJOBS -->|"all pass"| APM["auto-pr-to-main\nopens / reuses PR"]
    TODJOBS -.->|"any fail"| STOP(["no promotion"]):::stop

    APM -->|"bot-authored PR\n(needs manual Approve-and-run click)"| PRMAIN{{"PR into main"}}

    subgraph MAINCHECKS[" "]
        direction LR
        GM["guard-main\nhead must be dev"]:::gate
        SC2["SonarCloud\nquality gate"]:::advisory
        REV["1 human approval\n(Protect-main ruleset)"]:::gate
    end

    PRMAIN --> MAINCHECKS
    MAINCHECKS -->|"merge"| MAIN(("main")):::branch

    MAIN -->|"push"| DEPLOY["Deploy\nSSH → VPS\ndocker compose up --build"]:::deploy
    MAIN -->|"push"| SC3["SonarCloud\nfinal report"]:::advisory
```

## Legend

| Color | Meaning |
|---|---|
| 🔵 Blue | A branch (`dev` / `main`) |
| 🟣 Purple | **Gate** — must pass or the merge is blocked / promotion doesn't happen |
| ⚪ Grey | **Advisory** — runs and reports, doesn't block anything |
| 🔴 Red | Deployment |

## Known quirk: the bot-approval click

`auto-pr-to-main` opens the `dev → main` PR using `GITHUB_TOKEN`, so it's authored by `github-actions[bot]`. Any `pull_request`-triggered workflow scoped to `main` (`guard-main`, `SonarCloud`'s `main` leg) requires a manual "Approve and run" click on that specific PR every time — GitHub's workflow-approval gate treats bot-authored PRs the same as a first-time external contributor. This is why `SonarCloud` and `Lighthouse` review PRs into **`dev`** instead (human-authored, no click needed) rather than `main`.

## What's not shown

- `test-on-dev.yml` and `guard-main.yml` are separate workflow files; the diagram groups their jobs by the branch event that triggers them, not by file.
- Swagger/OpenAPI docs (`/api-docs`) and the `.gitleaks.toml` allowlist exist in the repo but aren't pipeline steps — they don't run on push/PR.
- Deferred, not built: Playwright e2e, PostHog / Prometheus+Grafana observability.

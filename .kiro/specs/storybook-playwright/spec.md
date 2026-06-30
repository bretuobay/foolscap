# Storybook + Playwright Tooling

> Add Foolscap's component review, accessibility, and visual regression tooling.
> **Phase:** 0.2 tooling extension
> **Audience:** AI coding agents (Claude, Kiro, Codex)

---

## 1 — Product Context

Foolscap requires browser-real validation because the PRD treats accessibility
and cross-framework parity as release gates, not optional polish:

- `research-docs/PRD.md` §11 requires WCAG 2.2 AA, ARIA Authoring Practices,
  automated axe checks, and manual screen-reader review.
- `research-docs/PRD.md` §15 defines browser behavior tests, adapter smoke
  tests, automated accessibility checks, and visual regression snapshots.
- `research-docs/PRD.md` §16 calls for live examples in all supported
  consumption modes.
- `research-docs/implementation-guide.md` Phase 5 calls for Playwright
  screenshots across component states and responsive widths.
- `research-docs/implementation-guide.md` Phase 6 calls for automated axe
  checks on component pages.

This spec adds the tooling surface only. It does not implement component source.

---

## 2 — Decisions

### 2.1 Storybook scope

Use a **React + Vite Storybook first**.

Why:

- The roadmap ships React before Vue and Angular.
- React and Vue can share Vite-based Storybook setup later.
- Angular has a separate Storybook builder path and should be added once the
  Angular adapter contains real components.

Future Vue and Angular support should use composed Storybooks or separate
framework Storybook apps. Do not add Vue/Angular Storybook dependencies in this
phase.

### 2.2 Playwright scope

Use `@playwright/test` at the repo root for:

- Storybook-backed visual regression.
- Future full-page docs/playground checks.
- Explicit Chromium installation via `pnpm test:setup`.

Use Chromium only at this phase. Add Firefox/WebKit later only when browser API
coverage requires it.

### 2.3 Accessibility scope

Use two layers:

- `@storybook/addon-a11y` for local, interactive review.
- `@storybook/test-runner` with axe injection for automated Storybook checks.

Core behavior tests remain in `packages/core` Vitest browser mode.

---

## 3 — Repository Changes

### Workspace

Update `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
```

Add:

```txt
apps/storybook/
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   └── test-runner.ts
└── stories/
    ├── button.stories.tsx
    └── classless.stories.tsx
```

Add root Playwright files:

```txt
playwright.config.ts
tests/visual/storybook-smoke.spec.ts
```

### Root scripts

Add:

```json
{
  "storybook": "turbo storybook --filter=@foolscap/storybook",
  "build:storybook": "turbo build:storybook --filter=@foolscap/storybook",
  "test:storybook": "turbo test:storybook --filter=@foolscap/storybook",
  "test:e2e": "turbo test:e2e",
  "test:visual": "turbo test:visual",
  "test:setup": "playwright install chromium"
}
```

### Turbo tasks

Add:

```json
{
  "storybook": {
    "dependsOn": ["^build"],
    "cache": false,
    "persistent": true
  },
  "build:storybook": {
    "dependsOn": ["^build"],
    "outputs": ["storybook-static/**"]
  },
  "test:storybook": {
    "dependsOn": ["build:storybook"],
    "outputs": []
  },
  "test:e2e": {
    "dependsOn": ["^build"],
    "outputs": []
  },
  "test:visual": {
    "dependsOn": ["build:storybook"],
    "outputs": []
  }
}
```

---

## 4 — Acceptance Criteria

Setup:

- `pnpm install` exits 0.
- `pnpm test:setup` installs Chromium or reports a documented environment
  failure.

Storybook:

- `pnpm storybook` starts Storybook on port 6006.
- `pnpm build:storybook` emits `apps/storybook/storybook-static/`.
- Storybook imports `@web-loom/foolscap-css/foolscap.css`, so package builds
  must precede Storybook builds.

Tests:

- `pnpm test:storybook` runs Storybook test-runner against a running Storybook.
- `pnpm test:e2e` runs Playwright.
- `pnpm test:visual` checks Storybook screenshots at:
  - 375 × 812
  - 768 × 1024
  - 1280 × 800

Existing gates:

- `pnpm format:check` passes.
- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
- `pnpm build` passes.

---

## 5 — References

- Storybook docs: <https://storybook.js.org/docs>
- Storybook test runner: <https://storybook.js.org/docs/writing-tests/test-runner>
- Storybook accessibility testing: <https://storybook.js.org/docs/writing-tests/accessibility-testing>
- Playwright visual comparisons: <https://playwright.dev/docs/test-snapshots>

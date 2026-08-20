# React Storybook

The React documentation app for `@web-loom/foolscap-react`. It contains component examples, generated API documentation, accessibility checks, and the repository's browser and visual test entry points.

## Run locally

From the repository root:

```sh
pnpm storybook
```

Storybook is available at `http://localhost:6006`. The root task builds package dependencies before starting the persistent development server.

Package-scoped commands are also available:

```sh
pnpm --filter @foolscap/storybook storybook
pnpm --filter @foolscap/storybook lint
pnpm --filter @foolscap/storybook typecheck
```

## Working with stories

- Add component stories under `stories/` using `*.stories.tsx`.
- Use titles such as `Tier 1/Button` to preserve tier navigation.
- Add the `autodocs` tag when Storybook should generate component documentation.
- Global CSS, controls, layout, and accessibility behavior are configured in `.storybook/preview.ts`.
- Framework, addon, and story-discovery settings live in `.storybook/main.ts`.

Stories should demonstrate the smallest useful API, important variants and states, keyboard behavior for interactive components, and accessible names where the UI does not provide visible text.

## Static build and tests

Build the static app from the root:

```sh
pnpm build:storybook
```

The output is written to `apps/storybook/storybook-static/`. Serve an existing build at `http://127.0.0.1:6006` with:

```sh
pnpm --filter @foolscap/storybook serve:storybook
```

The React app owns the Storybook, end-to-end, and visual test workflows:

```sh
pnpm test:storybook
pnpm test:e2e
pnpm test:visual
```

Browser tests use the root `playwright.config.ts`. Install the configured Chromium browser with `pnpm test:setup` when setting up a new environment.

Related package: [`@web-loom/foolscap-react`](../../packages/react/README.md).

[Back to the workspace guide](../../README.md)

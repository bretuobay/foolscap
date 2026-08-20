# Angular Storybook

The Angular documentation app for `@web-loom/foolscap-angular`. It contains component examples, generated API documentation, and accessibility checks for the standalone Angular adapter.

## Run locally

From the repository root:

```sh
pnpm storybook:angular
```

Storybook is available at `http://localhost:6008`. The root task builds package dependencies before starting the persistent development server.

Package-scoped commands are also available:

```sh
pnpm --filter @foolscap/storybook-angular storybook
pnpm --filter @foolscap/storybook-angular lint
pnpm --filter @foolscap/storybook-angular typecheck
```

## Working with stories

- Add component stories under `stories/` using `*.stories.ts`.
- Use titles such as `Tier 1/Button` to preserve tier navigation.
- Add the `autodocs` tag when Storybook should generate component documentation.
- Prefer standalone component imports and templates that match consumer usage.
- Global CSS, Zone.js, controls, layout, and accessibility behavior are configured in `.storybook/preview.ts`.
- Analog, Vite, addon, and story-discovery settings live in `.storybook/main.ts`.

Stories should demonstrate the smallest useful API, important variants and states, keyboard behavior for interactive components, and accessible names where the UI does not provide visible text.

## Analog compatibility

This app uses `@analogjs/storybook-angular`. Its package scripts set `ANALOG_STORYBOOK=true`, and the workspace pins TypeScript 5.8 to stay within Angular 19's supported compiler range. The Storybook configuration also owns the current Analog preview and websocket compatibility handling; keep those settings in place when changing the builder.

## Static build

Build the static app from the root:

```sh
pnpm build:storybook:angular
```

The output is written to `apps/storybook-angular/storybook-static/`. Serve an existing build at `http://127.0.0.1:6008` with:

```sh
pnpm --filter @foolscap/storybook-angular serve:storybook
```

Related package: [`@web-loom/foolscap-angular`](../../packages/angular/README.md).

[Back to the workspace guide](../../README.md)

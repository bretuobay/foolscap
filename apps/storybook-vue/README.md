# Vue Storybook

The Vue documentation app for `@web-loom/foolscap-vue`. It contains component examples, generated API documentation, and accessibility checks for the Vue adapter.

## Run locally

From the repository root:

```sh
pnpm storybook:vue
```

Storybook is available at `http://localhost:6007`. The root task builds package dependencies before starting the persistent development server.

Package-scoped commands are also available:

```sh
pnpm --filter @foolscap/storybook-vue storybook
pnpm --filter @foolscap/storybook-vue lint
pnpm --filter @foolscap/storybook-vue typecheck
```

## Working with stories

- Add component stories under `stories/` using `*.stories.ts`.
- Use titles such as `Tier 1/Button` to preserve tier navigation.
- Add the `autodocs` tag when Storybook should generate component documentation.
- Reuse `stories/render.ts` for consistent Vue render functions where appropriate.
- Global CSS, controls, layout, and accessibility behavior are configured in `.storybook/preview.ts`.
- Framework, addon, and story-discovery settings live in `.storybook/main.ts`.

Stories should demonstrate the smallest useful API, important variants and states, keyboard behavior for interactive components, and accessible names where the UI does not provide visible text.

## Static build

Build the static app from the root:

```sh
pnpm build:storybook:vue
```

The output is written to `apps/storybook-vue/storybook-static/`. Serve an existing build at `http://127.0.0.1:6007` with:

```sh
pnpm --filter @foolscap/storybook-vue serve:storybook
```

Related package: [`@web-loom/foolscap-vue`](../../packages/vue/README.md).

[Back to the workspace guide](../../README.md)

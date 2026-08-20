# Foolscap

Foolscap is a paper-styled, black-and-white design system built around one constraint: remove UI complexity before it becomes API.

It combines design tokens, a portable CSS skin, framework-independent interaction machines, and thin React, Vue, and Angular adapters. The visual language is intentionally quiet: off-white paper, near-black ink, hairline rules, restrained type, and a grey ramp for low-emphasis and loading states.

The long-term goal is the simplest credible version of the components catalogued by [The Component Gallery](https://component.gallery/), plus layout primitives, usable from plain HTML or a supported framework.

## Workspace

This repository is a pnpm and Turborepo workspace. Packages are currently consumed within the monorepo and are not documented as published registry releases.

### Public packages

| Package                                                    | Purpose                                                                           |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`@web-loom/foolscap-tokens`](packages/tokens/README.md)   | Design-token source, TypeScript token names, and generated CSS custom properties. |
| [`@web-loom/foolscap-css`](packages/css/README.md)         | Classless HTML styles, layout primitives, and component CSS.                      |
| [`@web-loom/foolscap-core`](packages/core/README.md)       | Framework-independent interaction machines and accessibility prop getters.        |
| [`@web-loom/foolscap-react`](packages/react/README.md)     | React 19+ components and hooks.                                                   |
| [`@web-loom/foolscap-vue`](packages/vue/README.md)         | Vue 3.4+ components and composables.                                              |
| [`@web-loom/foolscap-angular`](packages/angular/README.md) | Angular 18+ standalone components and bindings.                                   |

### Documentation apps

| App                                                               | Port | Purpose                                                       |
| ----------------------------------------------------------------- | ---: | ------------------------------------------------------------- |
| [`@foolscap/storybook`](apps/storybook/README.md)                 | 6006 | React component stories, interaction tests, and visual tests. |
| [`@foolscap/storybook-vue`](apps/storybook-vue/README.md)         | 6007 | Vue component stories and autodocs.                           |
| [`@foolscap/storybook-angular`](apps/storybook-angular/README.md) | 6008 | Angular component stories and autodocs.                       |

Internal packages under `tooling/` share ESLint, Prettier, TypeScript, tsup, and Vite configuration across the workspace.

## Architecture

Foolscap separates visual decisions from behavior:

1. Tokens define the design language.
2. CSS applies the paper skin to semantic HTML and explicit component parts.
3. Core implements portable interaction behavior for enhanced and composite widgets.
4. Framework adapters bind the shared CSS and core behavior to framework idioms.

This makes adoption incremental: use only the stylesheet for semantic HTML, use a framework adapter for finished components, consume core with custom rendering, or override tokens to retheme the system.

### Component tiers

- **Tier 1 — presentational and native controls:** CSS-first components such as Button, Alert, Card, Checkbox, Table, Spinner, and Color Picker.
- **Tier 2 — platform-enhanced components:** native elements with a focused behavior layer, such as Accordion, Toggle, Popover, Form, and File Upload.
- **Tier 3 — behavior-driven components:** composite widgets backed by core machines, such as Select, Combobox, Datepicker, Carousel, Tree View, and Rich Text Editor.

The React, Vue, and Angular packages expose components across all three tiers. Story coverage and framework-specific APIs live in their respective Storybook apps and package READMEs.

## Getting started

Requirements:

- Node.js 20 or newer
- pnpm 9 or newer

Install and build the workspace:

```sh
pnpm install
pnpm build
```

Run one of the documentation apps:

```sh
pnpm storybook
pnpm storybook:vue
pnpm storybook:angular
```

For example, a React workspace consumer imports the shared stylesheet once and then uses the adapter:

```tsx
import '@web-loom/foolscap-css/foolscap.css'
import { Button, Card, CardBody, CardTitle } from '@web-loom/foolscap-react'

export function Example() {
  return (
    <Card>
      <CardBody>
        <CardTitle>Paper-first components</CardTitle>
        <Button>Continue</Button>
      </CardBody>
    </Card>
  )
}
```

See the package guides above for CSS-only, core, Vue, and Angular examples.

## Development

Common repository commands:

```sh
pnpm build
pnpm test
pnpm lint
pnpm typecheck
pnpm format:check
```

Run a task for one workspace with a pnpm filter:

```sh
pnpm --filter @web-loom/foolscap-react test
pnpm --filter @web-loom/foolscap-css build
pnpm --filter @foolscap/storybook typecheck
```

Build static Storybooks with `pnpm build:storybook`, `pnpm build:storybook:vue`, or `pnpm build:storybook:angular`. React Storybook also supplies the repository's Storybook, end-to-end, and visual test workflows.

## Repository layout

```text
apps/
  storybook/          React Storybook
  storybook-vue/      Vue Storybook
  storybook-angular/  Angular Storybook
packages/
  tokens/             Token source and generated CSS
  css/                Classless, layout, and component CSS
  core/               Headless interaction machines
  react/              React components and hooks
  vue/                Vue components and composables
  angular/            Angular standalone components and bindings
tooling/               Shared workspace configuration
research-docs/         Product and interaction research
.kiro/specs/           Component and package specifications
```

## Product principles

- Smallest defensible API.
- Platform-first semantics before custom behavior.
- One mental model across frameworks.
- Tokenized styling instead of runtime styling.
- Accessible defaults for keyboard, focus, and screen-reader use.
- A finished paper aesthetic without required brand setup.

## License

MIT

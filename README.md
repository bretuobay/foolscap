# Foolscap

Foolscap is a paper-styled, black-and-white design system built around one product constraint: most UI complexity should be removed before it becomes API.

It ships design tokens, a portable CSS skin, a framework-agnostic behavior core, and thin framework adapters. The default visual language is intentionally quiet: off-white paper, near-black ink, hairline rules, restrained type, and a grey ramp for low-emphasis and loading states.

The long-term product goal is the simplest credible version of the 60 components catalogued by The Component Gallery, plus layout primitives, usable from plain HTML, React, Vue, and Angular.

## Packages

This repository is a pnpm/Turborepo workspace.

| Package                      | Purpose                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| `@web-loom/foolscap-tokens`  | Design tokens and compiled CSS custom properties.                           |
| `@web-loom/foolscap-css`     | Classless HTML styles plus class-based component CSS.                       |
| `@web-loom/foolscap-core`    | Framework-free TypeScript behavior machines and accessibility prop-getters. |
| `@web-loom/foolscap-react`   | React adapter and styled React components.                                  |
| `@web-loom/foolscap-vue`     | Vue package placeholder/build target.                                       |
| `@web-loom/foolscap-angular` | Angular package placeholder/build target.                                   |
| `@foolscap/storybook`        | Storybook documentation and component examples.                             |

## Architecture

Foolscap separates visual decisions from behavior:

1. Tokens define the design language.
2. CSS applies the paper skin to classless HTML and explicit component parts.
3. Core implements portable interaction behavior for Tier 2 and Tier 3 components.
4. Framework adapters bind the shared CSS and core behavior to framework idioms.

The practical result is that teams can adopt Foolscap incrementally:

- Use only the stylesheet for polished semantic HTML.
- Use React components for a finished app surface.
- Use the headless core with custom CSS for a branded design system.
- Override tokens to retheme without editing component internals.

## Component Tiers

Foolscap tiers components by how much the platform already provides.

**Tier 1: presentational and native controls**

CSS-first components and native form controls. Examples: Button, Alert, Badge, Card, Checkbox, Text Input, Table, Spinner, Skeleton, Progress Bar, Color Picker.

**Tier 2: platform-enhanced components**

Native elements with a small behavior shim where needed. Examples: Accordion, Popover, Toggle, Form, File Upload.

**Tier 3: behavior-driven components**

Components backed by headless machines in `@web-loom/foolscap-core`. Examples: Combobox, Select, Dropdown Menu, Datepicker, Carousel, Tree View, Rich Text Editor.

## Installation

The packages are currently workspace packages in this repo.

```sh
pnpm install
```

For React usage inside the workspace:

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

For CSS-only usage:

```ts
import '@web-loom/foolscap-css/foolscap.css'
```

## Development

Requirements:

- Node.js `>=20`
- pnpm `>=9`

Common commands:

```sh
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
pnpm storybook
```

Package-scoped examples:

```sh
pnpm --filter @web-loom/foolscap-react test
pnpm --filter @web-loom/foolscap-css build
pnpm --filter @foolscap/storybook typecheck
```

## Repository Layout

```text
apps/
  storybook/        Storybook docs, examples, a11y/e2e harness
packages/
  tokens/           Design token source and builds
  css/              Classless and component CSS
  core/             Headless behavior machines
  react/            React components and hooks
  vue/              Vue package target
  angular/          Angular package target
research-docs/      Product and planning documents
.kiro/specs/        Component and package specs
```

## Current Status

The React package currently covers the tracked Tier 1, Tier 2, and Tier 3 component specs with Storybook examples. The CSS package includes classless styles, component CSS, and token-driven styling. The core package contains the shared behavior machines for interactive components.

Vue and Angular packages exist as workspace targets but do not yet have adapter parity with React.

## Product Principles

- Smallest defensible API.
- Platform-first semantics before custom behavior.
- One mental model across frameworks.
- Tokenized styling, not runtime styling.
- Accessible defaults for keyboard, focus, and screen-reader use.
- Finished paper aesthetic without requiring brand setup.

## License

MIT

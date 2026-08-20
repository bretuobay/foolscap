# `@web-loom/foolscap-react`

The React 19+ adapter for Foolscap. It provides typed components and hooks that combine the shared paper-styled CSS with the interaction machines from `@web-loom/foolscap-core`.

This package is currently consumed as part of the Foolscap workspace rather than as a published registry release.

## Usage

Import the Foolscap stylesheet once in the application entry point, then import components from the adapter:

```tsx
import '@web-loom/foolscap-css/foolscap.css'
import { Button, Card, CardBody, CardDescription, CardTitle } from '@web-loom/foolscap-react'

export function WelcomeCard() {
  return (
    <Card>
      <CardBody>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Your workspace is ready.</CardDescription>
        <Button variant="primary">Continue</Button>
      </CardBody>
    </Card>
  )
}
```

The adapter requires `react` and `react-dom` 19 or newer as peer dependencies.

## Package shape

- Tier 1 exports cover presentational components, native controls, content, and layout primitives.
- Tier 2 exports wrap focused machines such as Accordion, Toggle, Popover, Form, and File Upload.
- Tier 3 exports provide composite widgets such as Select, Combobox, Modal, Tabs, Datepicker, Tree View, Carousel, and Rich Text Editor.
- Hooks such as `useMachine` and `useToast` expose framework bindings where direct coordination is useful.

Component props and related types are exported from the package entry point. Browse and exercise the components in the [React Storybook app](../../apps/storybook/README.md).

## Development

From the repository root:

```sh
pnpm --filter @web-loom/foolscap-react build
pnpm --filter @web-loom/foolscap-react test
pnpm --filter @web-loom/foolscap-react lint
pnpm --filter @web-loom/foolscap-react typecheck
```

Use `pnpm storybook` to run the React documentation app at `http://localhost:6006`.

Related packages: [CSS](../css/README.md), [core](../core/README.md), and [tokens](../tokens/README.md).

[Back to the workspace guide](../../README.md)

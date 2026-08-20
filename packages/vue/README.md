# `@web-loom/foolscap-vue`

The Vue 3 adapter for Foolscap. It provides typed components and composables that combine the shared paper-styled CSS with the interaction machines from `@web-loom/foolscap-core`.

This package is currently consumed as part of the Foolscap workspace rather than as a published registry release.

## Usage

Import the Foolscap stylesheet once in the application entry point. Components can then be imported directly in a single-file component:

```vue
<script setup lang="ts">
import '@web-loom/foolscap-css/foolscap.css'
import { Button, Card, CardBody, CardDescription, CardTitle } from '@web-loom/foolscap-vue'
</script>

<template>
  <Card>
    <CardBody>
      <CardTitle>Welcome back</CardTitle>
      <CardDescription>Your workspace is ready.</CardDescription>
      <Button variant="primary">Continue</Button>
    </CardBody>
  </Card>
</template>
```

The adapter requires Vue 3.4 or newer as a peer dependency.

## Package shape

- Tier 1 exports cover presentational components, native controls, content, and layout primitives.
- Tier 2 exports wrap focused machines such as Accordion, Toggle, Popover, Form, and File Upload.
- Tier 3 exports provide composite widgets such as Select, Combobox, Modal, Tabs, Datepicker, Tree View, Carousel, and Rich Text Editor.
- Composables such as `useMachine`, `useStableCallback`, and `useToast` expose framework bindings where direct coordination is useful.

Component props and related types are exported from the package entry point. Browse and exercise the components in the [Vue Storybook app](../../apps/storybook-vue/README.md).

## Development

From the repository root:

```sh
pnpm --filter @web-loom/foolscap-vue build
pnpm --filter @web-loom/foolscap-vue test
pnpm --filter @web-loom/foolscap-vue lint
pnpm --filter @web-loom/foolscap-vue typecheck
```

Use `pnpm storybook:vue` to run the Vue documentation app at `http://localhost:6007`.

Related packages: [CSS](../css/README.md), [core](../core/README.md), and [tokens](../tokens/README.md).

[Back to the workspace guide](../../README.md)

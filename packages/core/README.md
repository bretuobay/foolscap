# `@web-loom/foolscap-core`

Framework-independent interaction machines for Foolscap's enhanced and composite components. Core owns state transitions, keyboard behavior, accessibility attributes, subscriptions, and cleanup while leaving DOM rendering to the consumer or a framework adapter.

This package is currently consumed as part of the Foolscap workspace rather than as a published registry release.

## Usage

Create a machine, apply its prop getter to the rendered element, subscribe to state, and destroy it when the owning view is removed:

```ts
import { createToggle } from '@web-loom/foolscap-core'

const button = document.querySelector<HTMLButtonElement>('[data-toggle]')!
const toggle = createToggle({ defaultChecked: false })

toggle.setRootEl(button)

function render() {
  const props = toggle.getRootProps()
  button.setAttribute('role', props.role)
  button.setAttribute('aria-checked', String(props['aria-checked']))
  button.tabIndex = props.tabIndex
  button.onclick = props.onClick
  button.onkeydown = props.onKeyDown
}

const unsubscribe = toggle.subscribe(render)
render()

// When the view is removed:
unsubscribe()
toggle.destroy()
```

Machines support controlled or uncontrolled state where the component requires it. Their exact options, state, and prop getters are exported as TypeScript types from the package entry point.

## Capabilities

- Tier 2 machines include Accordion, Popover, File Upload, Toggle, and Form.
- Tier 3 machines include Modal, Tabs, Toast, Tooltip, Select, Combobox, Drawer, Dropdown Menu, Datepicker, Navigation, Pagination, Segmented Control, Rating, Progress Indicator, Stepper, Tree View, Carousel, and Rich Text Editor.
- Shared utilities cover IDs, event dispatch, keyboard navigation, focus traps, and roving tabindex.

Most applications should use the [React](../react/README.md), [Vue](../vue/README.md), or [Angular](../angular/README.md) adapter. Use core directly when building another adapter or rendering the machines with a custom view layer.

## Development

From the repository root:

```sh
pnpm --filter @web-loom/foolscap-core build
pnpm --filter @web-loom/foolscap-core test
pnpm --filter @web-loom/foolscap-core lint
pnpm --filter @web-loom/foolscap-core typecheck
```

[Back to the workspace guide](../../README.md)

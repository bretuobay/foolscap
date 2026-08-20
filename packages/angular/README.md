# `@web-loom/foolscap-angular`

The Angular 18+ adapter for Foolscap. It provides standalone components and injection-based bindings that combine the shared paper-styled CSS with the interaction machines from `@web-loom/foolscap-core`.

This package is currently consumed as part of the Foolscap workspace rather than as a published registry release.

## Usage

Import the Foolscap stylesheet once from the application's global stylesheet:

```css
@import '@web-loom/foolscap-css/foolscap.css';
```

Import standalone Foolscap components into the component that uses them:

```ts
import { Component } from '@angular/core'
import { Button, Card, CardBody, CardDescription, CardTitle } from '@web-loom/foolscap-angular'

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [Button, Card, CardBody, CardDescription, CardTitle],
  template: `
    <fc-card>
      <fc-card-body>
        <fc-card-title>Welcome back</fc-card-title>
        <fc-card-description>Your workspace is ready.</fc-card-description>
        <button fc-button variant="primary">Continue</button>
      </fc-card-body>
    </fc-card>
  `,
})
export class WelcomeCard {}
```

The adapter requires Angular common and core 18 or newer plus RxJS 7.8 or newer as peer dependencies.

## Package shape

- Tier 1 exports cover presentational components, native controls, content, and layout primitives.
- Tier 2 exports wrap focused machines such as Accordion, Toggle, Popover, Form, and File Upload.
- Tier 3 exports provide composite widgets such as Select, Combobox, Modal, Tabs, Datepicker, Tree View, Carousel, and Rich Text Editor.
- Bindings such as `injectMachine`, `injectStableCallback`, and `injectToast` integrate machine lifecycle with Angular injection contexts.

Component props and related types are exported from the package entry point. Browse and exercise the components in the [Angular Storybook app](../../apps/storybook-angular/README.md).

## Development

From the repository root:

```sh
pnpm --filter @web-loom/foolscap-angular build
pnpm --filter @web-loom/foolscap-angular test
pnpm --filter @web-loom/foolscap-angular lint
pnpm --filter @web-loom/foolscap-angular typecheck
```

Use `pnpm storybook:angular` to run the Angular documentation app at `http://localhost:6008`. The workspace pins TypeScript 5.8 for compatibility with Angular 19 and the current Analog Storybook integration.

Related packages: [CSS](../css/README.md), [core](../core/README.md), and [tokens](../tokens/README.md).

[Back to the workspace guide](../../README.md)

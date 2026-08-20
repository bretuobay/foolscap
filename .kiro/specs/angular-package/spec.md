# Angular Package

> Build `@web-loom/foolscap-angular` — the Angular adapter for the Foolscap design system.
> **Phase:** 4.2
> **Depends on:** `@web-loom/foolscap-core` (complete), `@web-loom/foolscap-css` (complete), `@web-loom/foolscap-vue` (behavioral + public-surface reference)
> **Blocks:** Angular Storybook (Wave 5)

---

## 1 — Overview

`@web-loom/foolscap-angular` wraps every Foolscap component as a standalone Angular component. It sits at the same layer as React and Vue: a thin adapter over shared CSS and shared core machines. It must not reimplement interaction logic.

Its responsibilities:

- **Tier 1 wrappers** — presentational components that apply `fc-*` classes and `data-*` attributes. No core imports.
- **Tier 2 bindings** — components that wire `@web-loom/foolscap-core` shims via `injectMachine`, pass DOM refs into the machine, and apply prop-getters onto host/template bindings.
- **Tier 3 bindings** — compound components that wire Tier-3 machines using Angular DI (`InjectionToken` + `inject()`) to coordinate root and child parts.
- **`injectToast()`** — imperative API for the Toast machine, provided from a `ToastProvider`.

### Source of truth

Do not invent a parallel Angular API. Match the **current Vue public surface** in `packages/vue/src/index.ts` (which already matches React), not the original Phase 3 spec tables.

| Layer | Owner | Angular adapter does |
|---|---|---|
| Anatomy, tokens, class names, `data-*` | `.kiro/specs/<component>/spec.md` + `@web-loom/foolscap-css` | Apply the same classes and attributes |
| Keyboard, ARIA, focus, positioning | `@web-loom/foolscap-core` | Create the machine, subscribe, apply prop-getters, destroy on teardown |
| Prop names, compound parts, variants | `packages/vue/src` | Same names; Angular idioms only where the host requires them (see §4) |

Work sequencing lives in [`waves.md`](./waves.md).

---

## 2 — Scaffold state (do not recreate)

These already exist as a starting point:

- `packages/angular/package.json` — name `@web-loom/foolscap-angular`
- `packages/angular/src/index.ts` — empty stub (`export {}`)
- Workspace wiring in `pnpm-workspace.yaml`, `vitest.workspace.ts`, and Turborepo tasks

The original stub used **tsup**. That is the wrong compiler for Angular templates. Wave 0 replaces tsup with **ng-packagr** (Angular Package Format / Ivy partial compilation).

---

## 3 — Tooling decision

Vue could keep tsup because it authored `defineComponent` + `h()` with no SFC compiler. Angular `@Component` templates must go through the Angular compiler.

| Concern | Decision |
|---|---|
| Library build | **ng-packagr** — Ivy partial compilation, FESM2022, typings |
| Tests | **Vitest + jsdom** via `@analogjs/vite-plugin-angular` and TestBed |
| Storybook | **`@analogjs/storybook-angular`** (Storybook 8 + Vite), new `apps/storybook-angular` |
| Authoring | Standalone components, inline templates, `ChangeDetectionStrategy.OnPush` |
| Angular version | Compile with **Angular 19** (matches repo TypeScript 5.7). Peer: `@angular/core` / `@angular/common` **`>=18`** |
| Modules | No `NgModule` public API. Standalone only. |
| CSS | Never imported by components. Consumers import `@web-loom/foolscap-css` once. |

Do not introduce `.scss` or component-scoped styles. Foolscap CSS is the skin.

---

## 4 — React / Vue → Angular idiom map

| React / Vue | Angular |
|---|---|
| `className` / `class` | Host `class` (merged by Angular) plus inner-class `cx()` when the host is not the styled node |
| `children` / default slot | `<ng-content />` |
| named slots (`iconStart`) | `<ng-content select="[fcIconStart]" />` |
| `ref` | `ElementRef` / `viewChild` / template ref; pass `.nativeElement` into machines |
| `createContext` / `provide`+`inject` | `InjectionToken` + `inject()`; throw if missing |
| `createPortal` / `Teleport` | CDK is out of scope; use `body` via a small `FcPortal` host or append in `afterNextRender` matching Vue’s `document.body` target |
| `onValueChange` | `@Input() value` + `@Output() valueChange` so banana-in-a-box `[(value)]` works. Also emit the Vue event names where cheap (`checkedChange`, `openChange`) |
| `v-model` / `modelValue` | `[(value)]` (Angular default). Do not add `[(ngModel)]` wrappers |
| `useMachine` | `injectMachine` (injection-context only) |
| `useStableCallback` | `injectStableCallback(() => this.onValueChange)` |
| CSS import in the component | never |

### Selectors (load-bearing)

Foolscap CSS uses child selectors such as `.fc-button-group > .fc-button`. The styled node **must be the host**, not a wrapped inner element.

| Kind | Selector pattern | Example |
|---|---|---|
| Native control | attribute on the native tag | `button[fc-button]`, `input[fc-text-input]`, `a[fc-link]` |
| Semantic landmark | attribute on the landmark tag | `header[fc-header]`, `footer[fc-footer]`, `article[fc-card]` |
| Dynamic tag (`Heading.level`, `List.variant`) | custom element that renders the native tag internally | `fc-heading`, `fc-list` |
| Compound part | custom element, host class is the BEM part | `fc-card-body` → host class `fc-card__body` |

Usage:

```html
<button fc-button variant="primary">Continue</button>
<article fc-card>
  <fc-card-body>
    <fc-card-title>Paper-first</fc-card-title>
  </fc-card-body>
</article>
```

Export **class names** still match Vue/React (`Button`, `CardBody`) so `import { Button } from '@web-loom/foolscap-angular'` is the same mental model.

### Fallthrough attrs

Native-host components already receive HTML attributes on the host. Do not re-bind `class` via `[class]` (that replaces the merged host class). Use static `host.class = 'fc-*'` so Angular merges consumer classes.

### Controlled mode

Same contract as Vue: `value` + `valueChange` (and the component-specific pair). Machines that read options via getters should close over `() => this.value`, not snapshot inputs at construct time.

---

## 5 — Bindings

### 5.1 — `injectMachine`

`src/bindings/inject-machine.ts`

```ts
export interface MachineInstance {
  subscribe(listener: (...args: unknown[]) => void): () => void
  destroy(): void
}

export function injectMachine<M extends MachineInstance>(factory: () => M): M
```

**Contract:**

- Factory runs exactly once per injector (component instance).
- `inject()` must run in an injection context; throw a descriptive error otherwise.
- Subscribe with `ChangeDetectorRef.markForCheck()` (OnPush). Do not require `NgZone.run()` if markForCheck is always used.
- `DestroyRef.onDestroy` unsubscribes and calls `machine.destroy()` exactly once.
- Factory must be side-effect free at creation time. DOM attachment belongs in `afterNextRender` / `ngAfterViewInit`.

Also export `useMachine` as an alias for cross-framework docs.

### 5.2 — `injectStableCallback`

Core machines capture callbacks at creation. Wrap every `on*` option:

```ts
export function injectStableCallback<T extends (...args: never[]) => unknown>(
  getFn: () => T | undefined,
): T
```

### 5.3 — `injectSubscription`

Subscribe so the current component re-renders when a shared machine (Toast) updates.

### 5.4 — `injectToast`

Must be called inside a `ToastProvider` injector. Throws otherwise. Return shape matches Vue `useToast`.

---

## 6 — Tier 1

### 6.1 — Pattern (native host)

```ts
@Component({
  selector: 'button[fc-button]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="fc-button__label"><ng-content /></span>
  `,
  host: {
    class: 'fc-button',
    '[attr.data-variant]': 'variant',
    '[attr.data-size]': 'size',
  },
})
export class Button {
  @Input() variant: ButtonProps['variant'] = 'primary'
  @Input() size: ButtonProps['size'] = 'md'
}
```

**Rules:**

1. Standalone + OnPush. Selector prefix `fc-`.
2. Host carries `fc-*` (or BEM part class). Merge consumer `class` via Angular host class merging, not `[class]`.
3. `variant` / `size` / `loading` map to `data-variant` / `data-size` / `data-state`.
4. Export the component class and its props type.
5. Do not import CSS or `@web-loom/foolscap-core`.
6. Compound parts live in the same file as Vue.

### 6.2 — Inventory

Same 37 families as Vue / `packages/vue/src/index.ts`. Read the Vue file for exact props, defaults, and DOM structure before writing the Angular file.

Layout primitives beyond `Stack` stay out of this phase.

---

## 7 — Tier 2 and Tier 3

Same wiring as Vue, translated:

1. Root calls `injectMachine(() => createX({ onChange: stableCallback }))`.
2. Root `providers: [{ provide: TOKEN, useFactory: ... }]` or a small context object on an `InjectionToken`.
3. Children `inject(TOKEN)` and throw if missing.
4. Apply `machine.getXProps()` onto the host via `[attr.*]` / `(event)` bindings.
5. When the machine needs a DOM node, assign in `afterNextRender` and clear on destroy.
6. Mirror machine state to `data-state` for CSS.
7. Overlays (Modal, Toast, listboxes) render at `document.body`.

Trigger-as-child (Popover, Tooltip): Angular cannot `cloneVNode`. Use a directive host on the consumer element (`button[fc-popover-trigger]`) or require the trigger component to wrap a native control. Prefer **attribute-host triggers** so the trigger node stays the consumer’s button.

---

## 8 — Layout and public surface

```
packages/angular/src/
├── test-setup.ts
├── bindings/
│   ├── inject-machine.ts
│   ├── inject-machine.test.ts
│   ├── inject-stable-callback.ts
│   └── inject-subscription.ts
├── utils/
│   ├── cx.ts
│   └── cx.test.ts
├── tier1/
├── tier2/
├── tier3/
└── index.ts
```

`src/index.ts` re-exports the same symbol names as Vue (`injectMachine` / `useMachine` instead of Vue composables).

---

## 9 — Test contract

| Tool | Purpose |
|---|---|
| `@testing-library/angular` | Render, query |
| `@testing-library/user-event` | Keyboard/pointer |
| `vitest` + `jsdom` | Runner |
| Angular `TestBed` | Injection-context helpers |

Tier 1: grouped smoke tests (render + class merge + snapshot of the styled node).

Tier 2/3: one test file per family; port Vue/React assertions.

---

## 10 — Acceptance criteria

- [ ] **AC-1:** `pnpm --filter @web-loom/foolscap-angular build` exits 0; `dist/` is Angular Package Format (FESM + typings).
- [ ] **AC-2:** `typecheck` and `lint` pass with 0 errors.
- [ ] **AC-3:** `pnpm --filter @web-loom/foolscap-angular test` passes.
- [ ] **AC-4:** Public export names match Vue (Angular-only: `injectMachine`, `injectToast`).
- [ ] **AC-5:** No Tier 1 file imports `@web-loom/foolscap-core`.
- [ ] **AC-6:** No component file imports CSS.
- [ ] **AC-7:** `injectMachine` factory once per instance; `destroy` once on teardown.
- [ ] **AC-8:** `injectToast()` outside `ToastProvider` throws a descriptive error.
- [ ] **AC-9:** Modal / Toaster / floating listboxes render under `document.body`.
- [ ] **AC-10:** Bundle does not inline `@floating-ui/dom`.
- [ ] **AC-11:** `pnpm build` at repo root still caches correctly.

The package is not Phase-4.2-complete until Wave 4 is done. Wave 5 (Storybook) can start after Wave 1 for visual feedback, then catch up per wave.

---

## 11 — Out of scope

- Changing core machines or CSS to “make Angular easier,” except a shared CSS fix React/Vue would also need.
- Layout primitives beyond `Stack`.
- An `NgModule` barrel (`FoolscapModule`).
- New visual variants or Angular-only components.
- Mixing Angular into `apps/storybook` or `apps/storybook-vue`.

# Vue Package

> Build `@web-loom/foolscap-vue` — the Vue 3 adapter for the Foolscap design system.
> **Phase:** 4.1
> **Depends on:** `@web-loom/foolscap-core` (complete), `@web-loom/foolscap-css` (complete), `@web-loom/foolscap-react` (behavioral reference)
> **Blocks:** Angular adapter (Phase 4.2), Vue Storybook (Wave 5)

---

## 1 — Overview

`@web-loom/foolscap-vue` wraps every Foolscap component as a typed Vue 3 component. It sits at the same layer as `@web-loom/foolscap-react`: a thin adapter over shared CSS and shared core machines. It must not reimplement interaction logic.

Its responsibilities:

- **Tier 1 wrappers** — presentational components that apply `fc-*` classes and `data-*` attributes. No core imports.
- **Tier 2 bindings** — components that wire `@web-loom/foolscap-core` shims (Accordion, Toggle, Form, FileUpload, Popover) via `useMachine`, pass DOM refs into the machine, and spread prop-getters onto elements.
- **Tier 3 bindings** — compound components that wire Tier-3 machines using `provide`/`inject` to coordinate root and child parts.
- **`useToast()` composable** — imperative API for the Toast machine, provided from a `ToastProvider`.

### Source of truth

Do not invent a parallel Vue API. Match the **current React public surface** in `packages/react/src/index.ts`, not the original Phase 3 spec tables (those drifted during implementation).

| Layer | Owner | Vue adapter does |
|---|---|---|
| Anatomy, tokens, class names, `data-*` | `.kiro/specs/<component>/spec.md` + `@web-loom/foolscap-css` | Apply the same classes and attributes |
| Keyboard, ARIA, focus, positioning | `@web-loom/foolscap-core` | Create the machine, subscribe, spread prop-getters, destroy on unmount |
| Prop names, compound parts, variants | `packages/react/src` | Same names; Vue idioms only where the host requires them (see §4) |

### What this spec covers

| Section | Content |
|---|---|
| §2 | Scaffold state (already done — do not recreate) |
| §3 | Tooling decision |
| §4 | React → Vue idiom map |
| §5 | Composables (`useMachine`, `useStableCallback`, `useSubscription`, `useToast`) |
| §6 | Tier 1 pattern + inventory |
| §7 | Tier 2 / 3 pattern + inventory |
| §8 | Source layout and public exports |
| §9 | Test contract |
| §10 | Acceptance criteria |
| §11 | Out of scope |

Work sequencing lives in [`waves.md`](./waves.md).

---

## 2 — Scaffold state (do not recreate)

These already exist and are correct as a starting point:

- `packages/vue/package.json` — name `@web-loom/foolscap-vue`, peer `vue >= 3.4`, dep `@web-loom/foolscap-core`
- `packages/vue/tsconfig.json` — extends `@foolscap/tsconfig/base.json`, `"jsx": "preserve"`
- `packages/vue/tsup.config.ts` — `entry: ['src/index.ts']`, externals: `vue`, `@web-loom/foolscap-core`
- `packages/vue/vitest.config.ts` — jsdom, `include: ['src/**/*.test.ts']`
- `packages/vue/src/index.ts` — empty stub (`export {}`)
- Workspace wiring in `pnpm-workspace.yaml`, `vitest.workspace.ts`, and Turborepo `build`/`test`/`lint`/`typecheck`

### Required package.json updates before implementation

Add the same style packages React uses (CSS is still imported by the consumer, not by each component):

```json
{
  "dependencies": {
    "@web-loom/foolscap-core": "workspace:*",
    "@web-loom/foolscap-css": "workspace:*",
    "@web-loom/foolscap-tokens": "workspace:*"
  }
}
```

Add test tooling:

```json
{
  "devDependencies": {
    "@vue/test-utils": "^2.4.0",
    "@testing-library/vue": "^8.1.0",
    "@testing-library/user-event": "^14.6.1",
    "@testing-library/jest-dom": "^6.9.1"
  }
}
```

Update vitest:

```ts
// packages/vue/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'vue',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

```ts
// packages/vue/src/test-setup.ts
import { config } from '@vue/test-utils'
import { afterEach } from 'vitest'

afterEach(() => {
  document.body.innerHTML = ''
})
```

Update tsup externals to include CSS/tokens:

```ts
external: [
  'vue',
  '@web-loom/foolscap-core',
  '@web-loom/foolscap-css',
  '@web-loom/foolscap-tokens',
]
```

---

## 3 — Tooling decision

The foundation spec deferred this: SFCs need `esbuild-plugin-vue3` or Vite library mode.

**Decision: keep tsup. Author Vue components as TypeScript using `defineComponent` + `h()`, not `.vue` SFCs and not Vue JSX.**

Reasons:

1. Foolscap components contain no component-scoped CSS. The main SFC benefit is unused.
2. Compound components (Tabs, Modal, Card, Header) stay in one file, matching React.
3. Existing tsup dual ESM/CJS output stays intact. No new compiler in the Vue package.
4. Types remain ordinary `.ts` exports.
5. `setup()` already runs once, which is a better machine lifecycle than React's render-phase init.

The implementation-guide checkbox for “Tier 1: SFC components” is explicitly overridden here. If Wave 1 DX is painful, a later tooling change to Vue JSX (`unplugin-vue-jsx` via tsup esbuild plugins) is allowed **without changing the public API**. Do not introduce `.vue` files in Phase 4.1.

**Component `name`:** set `name: 'FcButton'` (and equivalents) so Vue DevTools and warning stacks are readable.

---

## 4 — React → Vue idiom map

| React | Vue |
|---|---|
| `className` | `class` |
| `children` | default slot |
| `iconStart` / `iconEnd` / `fallback` as nodes | named slots of the same name |
| `ref` as a prop (React 19) | template ref on the native element; expose via `useTemplateRef` / returned vnode ref |
| `createContext` / `useContext` | `provide` / `inject` with a `InjectionKey` symbol; throw if missing |
| `createPortal(..., document.body)` | `h(Teleport, { to: 'body' }, [...])` |
| `cloneElement` / `asChild` (PopoverTrigger, TooltipTrigger) | single default-slot vnode + `cloneVNode` to merge machine props |
| `onClick` / `onKeyDown` from prop-getters | spread onto `h()` data (Vue 3 treats `onClick` as a listener) |
| `useEffect` for DOM registration | `onMounted` + `onBeforeUnmount`, or `watchEffect` when the el ref is set |
| `useCallbackRef` | `useStableCallback` (§5.2) |
| `useMachine` | `useMachine` (§5.1) — simpler: `setup()` runs once |
| CSS import in the component | never — consumers import `@web-loom/foolscap-css` once |

### Fallthrough attrs

Use `inheritAttrs: false` on every component that renders a single native root. Merge `attrs` onto that native element, and merge `class` last via `cx('fc-*', attrs.class)`.

Do not bind `class` twice (once from props, once from attrs). Vue 3 puts incoming `class`/`style` in `attrs` when they are not declared as props.

### Event names

Keep React-style callback props on the public API so the mental model matches: `onValueChange`, `onOpenChange`, `onCheckedChange`, `onClose`. Also emit the matching Vue events (`valueChange`, `openChange`, …) when it is cheap. Callers may use either `onValueChange` as a prop or `@value-change`.

Core custom events (`fc:change`, `fc:open`, …) continue to fire from the machine on DOM nodes. Adapters must not swallow them.

### Controlled mode

Same contract as React: `value` + `onValueChange` (or the component-specific pair). Vue `v-model` is supported via `modelValue` / `onUpdate:modelValue` **in addition to** the React names for components that are typically two-way bound (Toggle, Select, Combobox, Tabs, Rating, Stepper). Map:

```ts
const value = props.modelValue ?? props.value
const emitChange = (v: string) => {
  props.onValueChange?.(v)
  emit('update:modelValue', v)
}
```

Do not invent `v-model` for components React treats as one-way (Button, Alert, Card).

---

## 5 — Composables

### 5.1 — `useMachine`

`src/composables/useMachine.ts`

```ts
import { onUnmounted, shallowRef, triggerRef } from 'vue'

export interface MachineInstance {
  subscribe(listener: (...args: unknown[]) => void): () => void
  destroy(): void
}

export function useMachine<M extends MachineInstance>(factory: () => M): M {
  const machine = factory()
  const tick = shallowRef(0)

  const unsub = machine.subscribe(() => {
    tick.value++
    triggerRef(tick)
  })

  onUnmounted(() => {
    unsub()
    machine.destroy()
  })

  return machine
}
```

**Contract:**

- Factory runs exactly once per component instance (`setup()`).
- Subscribing must cause the component (or any computed that reads `tick` / `machine.state`) to re-render.
- `destroy()` runs exactly once on unmount.
- Factory must be side-effect free at creation time (no DOM mutations). DOM attachment belongs in `onMounted` or a ref watcher, matching React’s deferred-ref pattern.

Because Vue `setup()` does not re-run, callers that need the latest props inside the factory **must** close over refs/getters, not snapshot prop values. Copy the React Select pattern:

```ts
const optionsRef = shallowRef(props.options)
watch(() => props.options, (v) => { optionsRef.value = v })

const machine = useMachine(() =>
  createSelect({
    get options() { return optionsRef.value },
    onValueChange: stableOnValueChange,
  }),
)
```

### 5.2 — `useStableCallback`

`src/composables/useStableCallback.ts`

Core machines capture callbacks at creation. Vue props are not stale the way React closures are, but inline listeners passed into `createX({ onValueChange })` still would be if we snapped them once. Always wrap:

```ts
import { shallowRef, watchEffect } from 'vue'

export function useStableCallback<T extends (...args: never[]) => unknown>(
  fn: T | undefined,
): T {
  const ref = shallowRef(fn)
  watchEffect(() => {
    ref.value = fn
  })
  return ((...args: never[]) => ref.value?.(...args)) as T
}
```

Mandatory for every Tier 2/3 `on*` option passed into a machine factory.

### 5.3 — `useSubscription`

`src/composables/useSubscription.ts`

Same role as React `useSubscription`: subscribe so the current instance re-renders when a shared machine (Toast) updates. Used by `useToast`.

### 5.4 — `useToast`

`src/composables/useToast.ts`

Must be called inside a `ToastProvider` subtree. Throws a descriptive error otherwise.

```ts
export interface UseToastReturn {
  add(toast: Omit<Toast, 'id'>): string
  dismiss(id: string): void
  dismissAll(): void
  toasts: Toast[]
}
```

---

## 6 — Tier 1

### 6.1 — Pattern

```ts
import { defineComponent, h, type PropType } from 'vue'
import { cx } from '../utils/cx'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

export const Button = defineComponent({
  name: 'FcButton',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<ButtonProps['variant']>, default: 'primary' },
    size: { type: String as PropType<ButtonProps['size']>, default: 'md' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: (attrs.type as string | undefined) ?? 'button',
          'data-variant': props.variant,
          'data-size': props.size,
          'data-state': props.loading ? 'loading' : undefined,
          'aria-disabled': props.loading || props.disabled || undefined,
          disabled: props.disabled,
          class: cx('fc-button', attrs.class as string | undefined),
        },
        [
          slots.iconStart
            ? h('span', { class: 'fc-button__icon-start', 'aria-hidden': 'true' }, slots.iconStart())
            : null,
          h('span', { class: 'fc-button__label' }, slots.default?.()),
          slots.iconEnd
            ? h('span', { class: 'fc-button__icon-end', 'aria-hidden': 'true' }, slots.iconEnd())
            : null,
        ],
      )
  },
})
```

**Rules for every Tier 1 component:**

1. Named `defineComponent` with `name: 'Fc…'`. No extra wrapper utilities unless a repeated pattern is proven (do not start with a generic `primitive()` helper).
2. `inheritAttrs: false`; merge attrs onto the native root; `cx('fc-*', attrs.class)` last.
3. `variant` / `size` / `loading` map to `data-variant` / `data-size` / `data-state`.
4. Export the component and its props type.
5. Do not import CSS or `@web-loom/foolscap-core`.
6. Polymorphic roots (`Heading` `level`, `Card` `as`) use `h(tag, …)`.
7. Compound presentational parts (Card, Header, Footer, Hero, Breadcrumbs, AvatarGroup) live in the same file as React.

### 6.2 — Inventory (match React)

One file per row under `src/tier1/`. Public names must match `packages/react/src/index.ts`.

| Component | File | Root | FC class | Vue-specific notes |
|---|---|---|---|---|
| `Alert` | `Alert.ts` | `div` | `fc-alert` | |
| `Avatar`, `AvatarGroup` | `Avatar.ts` | `span` / `div` | `fc-avatar` | `fallback` → default slot or `fallback` slot |
| `Badge` | `Badge.ts` | `span` | `fc-badge` | |
| `Breadcrumbs`, `BreadcrumbItem` | `Breadcrumbs.ts` | `nav` / `li` | `fc-breadcrumbs` | |
| `Button` | `Button.ts` | `button` | `fc-button` | slots: `iconStart`, default, `iconEnd` |
| `ButtonGroup` | `ButtonGroup.ts` | `div` | `fc-button-group` | |
| `Card`, `CardMedia`, `CardBody`, `CardTitle`, `CardDescription`, `CardFooter` | `Card.ts` | `article` | `fc-card` | `as` prop on root |
| `Checkbox` | `Checkbox.ts` | native control | `fc-checkbox` | match React element structure |
| `ColorPicker` | `ColorPicker.ts` | native `input[type=color]` | `fc-color-picker` | |
| `DateInput` | `DateInput.ts` | native `input[type=date]` | `fc-date-input` | |
| `EmptyState` | `EmptyState.ts` | `div` | `fc-empty-state` | slots: `icon`, default, `action` |
| `Fieldset` | `Fieldset.ts` | `fieldset` | `fc-fieldset` | |
| `File` | `File.ts` | match React | `fc-file` | |
| `Footer`, `FooterGrid`, `FooterSectionTitle`, `FooterLinks`, `FooterBottom` | `Footer.ts` | `footer` | `fc-footer` | |
| `Header`, `HeaderBrand`, `HeaderNav`, `HeaderActions` | `Header.ts` | `header` | `fc-header` | |
| `Heading` | `Heading.ts` | `h1`–`h6` | `fc-heading` | `level` selects tag |
| `Hero`, `HeroEyebrow`, `HeroTitle`, `HeroDescription`, `HeroActions` | `Hero.ts` | `section` | `fc-hero` | |
| `Icon` | `Icon.ts` | `span` | `fc-icon` | default slot = SVG |
| `Image` | `Image.ts` | `figure` | `fc-image` | |
| `Label` | `Label.ts` | `label` | `fc-label` | |
| `Link` | `Link.ts` | `a` | `fc-link` | `external` → `target`/`rel` |
| `List` | `List.ts` | `ul`/`ol` | `fc-list` | |
| `ProgressBar` | `ProgressBar.ts` | `div` | `fc-progress-bar` | `role="progressbar"` |
| `Quote` | `Quote.ts` | `blockquote` | `fc-quote` | |
| `RadioButton` | `RadioButton.ts` | native radio | `fc-radio` | |
| `SearchInput` | `SearchInput.ts` | native search | `fc-search-input` | |
| `Separator` | `Separator.ts` | `hr` | `fc-separator` | |
| `Skeleton` | `Skeleton.ts` | `div` | `fc-skeleton` | |
| `SkipLink` | `SkipLink.ts` | `a` | `fc-skip-link` | |
| `Slider` | `Slider.ts` | native range | `fc-slider` | |
| `Spinner` | `Spinner.ts` | `span` | `fc-spinner` | |
| `Stack` | `Stack.ts` | `div` | `fc-stack` | `data-gap` / `data-align` |
| `Table` | `Table.ts` | match React | `fc-table` | |
| `TextInput` | `TextInput.ts` | `input` | `fc-text-input` | |
| `Textarea` | `Textarea.ts` | `textarea` | `fc-textarea` | |
| `Video`, `VideoEmbed` | `Video.ts` | `figure` | `fc-video` | |
| `VisuallyHidden` | `VisuallyHidden.ts` | `span` | `fc-visually-hidden` | |

**37 component families, ~55 exported symbols.** Read the corresponding React file for exact props, defaults, and DOM structure before writing the Vue file.

### 6.3 — Layout primitives (not in this phase)

CSS exists for AspectRatio, Box, Center, Columns, Container, Cover, Grid, Inline, Sidebar, Spacer, Switcher. React currently ships **only `Stack`**. Vue matches React. A later shared follow-up can add layout wrappers to both adapters.

---

## 7 — Tier 2 and Tier 3

### 7.1 — Shared wiring pattern

1. Root creates the machine with `useMachine(() => createX({ …, onChange: stableCallback }))`.
2. Root `provide`s `{ machine, … }` via a typed `InjectionKey`.
3. Children `inject` and throw if missing (`Tab must be used inside TabsRoot`).
4. Spread `machine.getXProps()` onto the host element; then overlay `class`, `data-state`, and any Vue-only attrs.
5. When the machine needs a DOM node (`setTriggerEl`, `register`, `createModal(dialogEl)`), assign in a ref callback or `onMounted` and clear on unmount.
6. Mirror machine state to `data-state` for CSS, exactly as React does.
7. Controlled props: prefer getter closures over recreating the machine.

### 7.2 — Trigger / slot children (Popover, Tooltip, DropdownMenu)

React clones the child element. Vue equivalent:

```ts
const children = slots.default?.()
const vnode = children?.[0]
if (!vnode) return null
return cloneVNode(vnode, machine.getTriggerProps(), true)
```

If the slot is empty or has multiple roots, warn in development and render nothing for the trigger.

### 7.3 — Overlay hosts (Modal, Toast, Select listbox, Combobox listbox)

Use `Teleport` to `body`, with an SSR guard:

```ts
const canUseDOM = typeof document !== 'undefined'
if (!canUseDOM) return null
return h(Teleport, { to: 'body' }, [content])
```

### 7.4 — Tier 2 inventory

| Component | File | Core factory | Parts (match React exports) |
|---|---|---|---|
| Accordion | `Accordion.ts` | `createAccordion` | `AccordionRoot`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel` |
| Toggle | `Toggle.ts` | `createToggle` | `Toggle` |
| Popover | `Popover.ts` | `createPopover` | `PopoverRoot`, `PopoverTrigger`, `PopoverContent`, `PopoverClose` |
| FileUpload | `FileUpload.ts` | `createFileUpload` | `FileUpload` |
| Form | `Form.ts` | `createForm` | `FormRoot`, `FormFields`, `FormErrorSummary`, `FormActions`, `useFormContext` |

Accordion still uses native `<details>`/`<summary>`. Register `detailsEl` on mount.

Toggle still renders a native checkbox with `role="switch"` and syncs `machine.state.checked`, matching React rather than a generic `role="switch"` div.

Form still attaches to a native `<form>` after mount (React uses a ref + effect). Same deferred-el pattern.

### 7.5 — Tier 3 inventory

| Component | File | Core factory | Parts (match React exports) |
|---|---|---|---|
| Tabs | `Tabs.ts` | `createTabs` | `TabsRoot`, `TabsList`, `Tab`, `TabPanel` |
| Modal | `Modal.ts` | `createModal` | `Modal`, `ModalHeader`, `ModalTitle`, `ModalBody`, `ModalFooter`, `ModalClose` |
| Tooltip | `Tooltip.ts` | `createTooltip` | `TooltipRoot`, `TooltipTrigger`, `TooltipContent` |
| Toast | `Toast.ts` | `createToaster` | `ToastProvider`, `Toaster`, `ToastItem`, `useToast` |
| Select | `Select.ts` | `createSelect` | `SelectRoot`, `SelectTrigger`, `SelectListbox` |
| Combobox | `Combobox.ts` | `createCombobox` | `ComboboxRoot`, `ComboboxInput`, `ComboboxListbox` |
| Drawer | `Drawer.ts` | `createDrawer` | `Drawer`, `DrawerHeader`, `DrawerTitle`, `DrawerClose`, `DrawerBody`, `DrawerFooter` |
| DropdownMenu | `DropdownMenu.ts` | `createDropdownMenu` | `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuSeparator` |
| Datepicker | `Datepicker.ts` | `createDatepicker` | `DatepickerRoot`, `DatepickerTrigger`, `DatepickerDialog` |
| Navigation | `Navigation.ts` | `createNavigation` | `NavigationRoot`, `NavigationToggle`, `NavigationList` |
| Pagination | `Pagination.ts` | `createPagination` | `PaginationRoot`, `PaginationList`, `PaginationPrev`, `PaginationNext`, `PaginationPageLink`, `PaginationEllipsis` |
| SegmentedControl | `SegmentedControl.ts` | `createSegmentedControl` | `SegmentedControlRoot`, `SegmentedControlItemView`, `SegmentedControlIndicator` |
| Rating | `Rating.ts` | `createRating` | `RatingRoot`, `RatingItems`, `RatingItem`, `RatingValueLabel`, `RatingReadOnlyIcon` |
| ProgressIndicator | `ProgressIndicator.ts` | `createProgressIndicator` | `ProgressIndicatorRoot`, `ProgressIndicatorStepView`, `ProgressIndicatorStepIndicator`, `ProgressIndicatorStepLabel`, `ProgressIndicatorStepDescription`, `ProgressIndicatorStepSrStatus` |
| Stepper | `Stepper.ts` | `createStepper` | `StepperRoot`, `StepperLabel`, `StepperDecrement`, `StepperInput`, `StepperIncrement`, `StepperHiddenInput` |
| TreeView | `TreeView.ts` | `createTreeView` | `TreeViewRoot`, `TreeViewItemView`, `TreeViewItemContent`, `TreeViewToggle`, `TreeViewLabel`, `TreeViewGroup` |
| Carousel | `Carousel.ts` | `createCarousel` | `CarouselRoot`, `CarouselViewport`, `CarouselControls`, `CarouselPrev`, `CarouselNext`, `CarouselIndicators`, `CarouselIndicator` |
| RichTextEditor | `RichTextEditor.ts` | `createRichTextEditor` | `RichTextEditorRoot`, `RichTextEditorToolbar`, `RichTextEditorToolbarGroup`, `RichTextEditorButton`, `RichTextEditorEditor`, `RichTextEditorLinkForm` |

**18 Tier 3 families.** Implement against the React file and the core factory types. Do not re-derive keyboard tables here — they belong to core and the per-component specs.

---

## 8 — Layout and public surface

```
packages/vue/src/
├── test-setup.ts
├── composables/
│   ├── useMachine.ts
│   ├── useMachine.test.ts
│   ├── useStableCallback.ts
│   ├── useSubscription.ts
│   └── useToast.ts
├── utils/
│   ├── cx.ts          ← copy from React; no Vue dependency
│   └── cx.test.ts
├── tier1/
│   ├── *.ts
│   └── tier1.test.ts  ← grouped smoke tests
├── tier2/
│   ├── Accordion.ts
│   ├── Accordion.test.ts
│   ├── Toggle.ts
│   ├── Toggle.test.ts
│   ├── Popover.ts
│   ├── Popover.test.ts
│   ├── FileUpload.ts
│   ├── FileUpload.test.ts
│   ├── Form.ts
│   └── Form.test.ts
├── tier3/
│   ├── Tabs.ts
│   ├── Tabs.test.ts
│   └── … one file + one test file per family
└── index.ts
```

`src/index.ts` re-exports the same symbol names as `packages/react/src/index.ts` (Vue composables instead of React hooks: `useMachine`, `useStableCallback`, `useToast`, `useFormContext`). Do not export `useCallbackRef`; that name is React-specific.

---

## 9 — Test contract

| Tool | Purpose |
|---|---|
| `@testing-library/vue` | Render, query |
| `@testing-library/user-event` | Keyboard/pointer |
| `@vue/test-utils` | Allowed for `provide`/`inject` edge cases |
| `vitest` + `jsdom` | Runner |

### Composables

**`useMachine`:** factory once; re-render on `subscribe`; `destroy` on unmount; no destroy on re-render.

**`useToast`:** `add` / `dismiss` / `dismissAll`; throws outside `ToastProvider`.

### Tier 1

One `tier1.test.ts` (or a few grouped files: primitives, form controls, structure) covering all families:

1. Renders without throwing.
2. `class` is merged, not replaced (`fc-*` still present).
3. Snapshot of the primary variant (inline snapshot).

### Tier 2 / 3

One test file per family. Port the assertions from the matching `packages/react/src/tier2|3/*.test.tsx`. Behavior must be identical; only the renderer changes.

Minimum for the first interactive wave (Tabs, Toggle, Accordion, Modal):

- Controlled prop is respected.
- Callback fires.
- Keyboard path covered by the React test still passes.
- Unmount does not leak listeners (no console errors).

---

## 10 — Acceptance criteria

- [ ] **AC-1:** `pnpm --filter @web-loom/foolscap-vue build` exits 0; `dist/` contains `index.js`, `index.cjs`, `index.d.ts`.
- [ ] **AC-2:** `typecheck` and `lint` pass with 0 errors.
- [ ] **AC-3:** `pnpm --filter @web-loom/foolscap-vue test` passes.
- [ ] **AC-4:** Public export names match React (minus React-only types like `React.ReactNode`).
- [ ] **AC-5:** No Tier 1 file imports `@web-loom/foolscap-core`.
- [ ] **AC-6:** No component file imports CSS.
- [ ] **AC-7:** `useMachine` factory once per instance; `destroy` once on unmount.
- [ ] **AC-8:** `useToast()` outside `ToastProvider` throws a descriptive error.
- [ ] **AC-9:** Modal / Toaster / floating listboxes render via `Teleport` to `document.body`.
- [ ] **AC-10:** Bundle does not inline `@floating-ui/dom` (external via core).
- [ ] **AC-11:** `pnpm build` at repo root still caches correctly.

Wave-level done definitions are in [`waves.md`](./waves.md). The package is not Phase-4.1-complete until Wave 4 is done. Wave 5 (Storybook) is separate.

---

## 11 — Out of scope

- Angular adapter (Phase 4.2). A short binding-model spike note may be written after Wave 0, but no Angular code in this spec.
- Vue Storybook app (Wave 5). Do not add Vue deps to `apps/storybook` (it is `@storybook/react-vite`).
- Layout primitives beyond `Stack`.
- Changing core machines or CSS to “make Vue easier.” If a machine is awkward to bind, fix the adapter first; only then consider a core `setXEl` helper that React would also use.
- New visual variants or extra Vue-only components.
- `.vue` SFC authoring in this phase.

# React Package

> Build `@web-loom/foolscap-react` — the React adapter for the Foolscap design system.
> **Phase:** 3 (3.2 → 3.6)
> **Depends on:** `@web-loom/foolscap-core` (Phase 2 complete), `@web-loom/foolscap-css` (Phase 1 complete)
> **Blocks:** Phase 4 (Vue/Angular adapters use Phase 2 directly, but the playground harness lives here)

---

## 1 — Overview

`@web-loom/foolscap-react` wraps every Foolscap component as a typed React component. It sits at the boundary between the framework-agnostic core and React's rendering model. Its responsibilities:

- **Tier 1 wrappers** — thin function components that apply CSS class names and `data-*` attributes. No behavior; pure rendering.
- **Tier 2 bindings** — React components that wire `@web-loom/foolscap-core` Tier-2 shims (Accordion, Toggle, Form, FileUpload, Popover) via `useMachine`, passing DOM refs into the machine and spreading prop-getters onto elements.
- **Tier 3 bindings** — compound React components that wire Tier-3 machines (Modal, Tabs, Toast, Tooltip, Select, Combobox) using context to coordinate between root and child components.
- **`useToast()` hook** — imperative API for the Toast machine, provided via React context from a `ToastProvider`.

### What this spec covers (Phase 3.2–3.6)

| Section | Content |
|---|---|
| §2 | Scaffold state (already done — do not recreate) |
| §3 | `cx` utility + `useCallbackRef` |
| §4 | `useStore` hook |
| §5 | `useMachine` hook — contract, stale-callback pattern, controlled sync |
| §6 | Tier 1 component pattern + complete component table (37 + 12) |
| §7 | Tier 2 component APIs |
| §8 | Tier 3 component APIs |
| §9 | `useToast` hook |
| §10 | Source directory layout |
| §11 | `src/index.ts` public surface |
| §12 | Test contract |
| §13 | Acceptance criteria |
| §14 | Implementation notes |

**Out of scope (Phase 3 — deferred to Phase 3.5+):** Drawer, DropdownMenu, Navigation, Carousel, Datepicker, Pagination, ProgressIndicator, Rating, SegmentedControl, Stepper, TreeView, RichTextEditor. The core machines for these are deferred to Phase 2.5; their React bindings follow immediately after.

---

## 2 — Scaffold state (do not recreate)

The following already exist and are correct:

- `packages/react/package.json` — needs two updates before implementation begins:
  - `peerDependencies.react`: change `">=18"` → `">=19"` (React 19 is required for `ref` as a prop)
  - `devDependencies`: bump `"react"` and `"react-dom"` to `"^19.0.0"`, `"@types/react"` and `"@types/react-dom"` to `"^19.0.0"`
- `packages/react/tsconfig.json` — extends `@foolscap/tsconfig/base.json`, `"jsx": "react-jsx"`
- `packages/react/tsup.config.ts` — `entry: ['src/index.ts']`, externals: react, react-dom, foolscap-core, foolscap-css, foolscap-tokens
- `packages/react/vitest.config.ts` — jsdom environment, `include: ['src/**/*.test.tsx', 'src/**/*.test.ts']`
- `packages/react/src/index.ts` — empty stub (`export {}`)

The vitest config needs one addition — a setup file for `@testing-library/react` cleanup:

```ts
// packages/react/vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'react',
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

```ts
// packages/react/src/test-setup.ts
import '@testing-library/react/pure'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
afterEach(() => cleanup())
```

---

## 3 — Utilities

### 3.1 — `cx` (classname joiner)

`src/utils/cx.ts` — no external dependency.

```ts
export function cx(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

### 3.2 — `useCallbackRef`

`src/hooks/useCallbackRef.ts` — stabilizes a callback so it never goes stale inside a machine.

```ts
import { useRef, useLayoutEffect, useCallback } from 'react'

export function useCallbackRef<T extends (...args: never[]) => unknown>(
  fn: T | undefined,
): T {
  const ref = useRef(fn)
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args: Parameters<T>) => ref.current?.(...args), []) as T
}
```

**Why this matters:** Core machines capture callbacks (`onValueChange`, `onOpen`, `onClose`) at creation time. Inline arrow functions in React re-create on every render, so without this pattern the machine always calls the stale version from the first render. By storing `fn` in a ref and calling `ref.current` inside a stable wrapper, callbacks always see the latest closure.

---

## 4 — `useStore`

`src/hooks/useStore.ts` — subscribes to a `Store<S, A>` and re-renders on changes.

```ts
import { useEffect, useReducer } from 'react'
import type { Store } from '@web-loom/store-core'

export function useStore<S extends object, A>(store: Store<S, A>): [S, A] {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  useEffect(() => {
    // Sync state that may have changed between render and effect
    forceUpdate()
    return store.subscribe(() => forceUpdate())
  }, [store])

  return [store.getState(), store.actions]
}
```

Used directly by components that hold their own `store` reference (rare). Most components use `useMachine` instead.

---

## 5 — `useMachine`

`src/hooks/useMachine.ts` — the primary binding hook. Creates a machine once, subscribes to its state changes for re-renders, and destroys it on unmount.

### 5.1 — Signature

```ts
export function useMachine<M extends MachineInstance>(factory: () => M): M
```

Where `MachineInstance` is the structural type every `@web-loom/foolscap-core` machine satisfies:

```ts
interface MachineInstance {
  readonly state: object
  subscribe(listener: (s: unknown, prev: unknown) => void): () => void
  destroy(): void
}
```

### 5.2 — Implementation contract

```ts
import { useRef, useReducer, useEffect } from 'react'

export function useMachine<M extends MachineInstance>(factory: () => M): M {
  const machineRef = useRef<M | null>(null)
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0)

  // Create machine synchronously on first render only (ref pattern, not useState,
  // to avoid double-creation in StrictMode with cleanup — factory must be idempotent)
  if (machineRef.current === null) {
    machineRef.current = factory()
  }

  useEffect(() => {
    const machine = machineRef.current!
    // Subscribe after mount; also handles StrictMode's second mount
    const unsub = machine.subscribe(() => forceUpdate())
    return unsub
  }, [])

  useEffect(() => {
    return () => {
      machineRef.current?.destroy()
      machineRef.current = null
    }
  }, [])

  return machineRef.current
}
```

### 5.3 — Stale-callback pattern (mandatory for all Tier 2/3 components)

Never pass inline callbacks directly to a machine factory. Always stabilize them first:

```tsx
// ✗ Wrong — onValueChange is stale after first render
const machine = useMachine(() => createTabs({ onValueChange }))

// ✓ Correct — stable wrapper always calls the latest onValueChange
const stableOnValueChange = useCallbackRef(onValueChange)
const machine = useMachine(() => createTabs({ onValueChange: stableOnValueChange }))
```

### 5.4 — Controlled prop sync

When a component is in controlled mode, prop changes must be pushed to the machine after each render. Use `useEffect` with the relevant prop in the dependency array:

```tsx
// Example: controlled Tabs
useEffect(() => {
  if (value !== undefined) machine./* no public setter on tabs — handled by controlled mode in state getter */
  // For machines that have explicit setters:
  // if (value !== undefined) machine.setXxx(value)
}, [value, machine])
```

Machines whose `state` getter already handles controlled mode (Tabs, Select, Combobox, Toggle — they read `opts.value` on each `getState()` call) do not need explicit prop-sync effects; re-rendering the component is sufficient because the factory captures the stable ref to the latest value.

**For machines that DO need explicit sync** (any machine with a `setXxx` imperative setter for controlled value): call the setter in a `useEffect` whenever the controlled prop changes.

---

## 6 — Tier 1 Components

### 6.1 — Pattern

Every Tier 1 component follows this structure:

```tsx
import { cx } from '../utils/cx'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconStart?: React.ReactNode
  iconEnd?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  iconStart,
  iconEnd,
  className,
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      data-variant={variant}
      data-size={size}
      data-state={loading ? 'loading' : undefined}
      aria-disabled={loading || undefined}
      className={cx('fc-button', className)}
      {...props}
    >
      {iconStart && (
        <span className="fc-button__icon-start" aria-hidden="true">
          {iconStart}
        </span>
      )}
      <span className="fc-button__label">{children}</span>
      {iconEnd && (
        <span className="fc-button__icon-end" aria-hidden="true">
          {iconEnd}
        </span>
      )}
    </button>
  )
}
```

In React 19, `ref` is a regular prop. With `@types/react@19`, `ref` lives in `React.RefAttributes<T>`. Extend both the element's attribute type and `React.RefAttributes<T>` so the prop appears in the component signature:

```ts
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    React.RefAttributes<HTMLButtonElement> { ... }
```

Destructure `ref` alongside the other props and forward it to the root element.

**Rules that apply to every Tier 1 component:**
1. Plain named function — no `forwardRef`. `ref` is destructured from props and forwarded to the root element.
2. `Props` interface extends `React.*HTMLAttributes<HTMLXxxElement>`. Variant/size/state props are removed from the spread via destructuring; `ref` is also destructured explicitly.
3. `variant`, `size`, `disabled`, `loading` (where applicable) map to `data-variant`, `data-size`, `:disabled`, `data-state` respectively.
4. `className` is always accepted and merged last via `cx('fc-classname', className)`.
5. Export both the component (`export function Foo`) and its props type (`export interface FooProps`).
6. Do not set `displayName` manually — the function name is sufficient for React DevTools and error messages.
7. Do not import CSS directly — consumers import `@web-loom/foolscap-css` once at the app level.

### 6.2 — Tier 1 component table

One file per row. File lives at `src/tier1/<File>`. All extend `React.HTMLAttributes` of the listed element unless noted.

| Component | File | Root element | FC class | Notable custom props |
|---|---|---|---|---|
| `Alert` | `Alert.tsx` | `<div>` | `fc-alert` | `variant?: 'info' \| 'success' \| 'warning' \| 'error'` |
| `Avatar` | `Avatar.tsx` | `<span>` | `fc-avatar` | `src?: string`, `alt?: string`, `size?: 'sm' \| 'md' \| 'lg'` |
| `Badge` | `Badge.tsx` | `<span>` | `fc-badge` | `variant?: 'default' \| 'success' \| 'warning' \| 'error'` |
| `Breadcrumbs` | `Breadcrumbs.tsx` | `<nav>` | `fc-breadcrumbs` | `children: React.ReactNode` — renders `<ol>` internally |
| `BreadcrumbItem` | `Breadcrumbs.tsx` | `<li>` | `fc-breadcrumbs__item` | `current?: boolean` → `aria-current="page"` |
| `Button` | `Button.tsx` | `<button>` | `fc-button` | `variant?`, `size?`, `loading?`, `iconStart?`, `iconEnd?` (see §6.1) |
| `ButtonGroup` | `ButtonGroup.tsx` | `<div>` | `fc-button-group` | `orientation?: 'horizontal' \| 'vertical'` |
| `Card` | `Card.tsx` | `<div>` | `fc-card` | `variant?: 'default' \| 'outlined' \| 'elevated'` |
| `Checkbox` | `Checkbox.tsx` | `<label>` | `fc-checkbox` | Extends `React.InputHTMLAttributes<HTMLInputElement>`; renders `<input type="checkbox">` + track internally; `label?: React.ReactNode` |
| `ColorPicker` | `ColorPicker.tsx` | `<label>` | `fc-color-picker` | Thin wrapper around `<input type="color">`; `label?: React.ReactNode` |
| `DateInput` | `DateInput.tsx` | `<label>` | `fc-date-input` | Thin wrapper around `<input type="date">`; `label?: React.ReactNode` |
| `EmptyState` | `EmptyState.tsx` | `<div>` | `fc-empty-state` | `icon?: React.ReactNode`, `title: string`, `description?: string`, `action?: React.ReactNode` |
| `Fieldset` | `Fieldset.tsx` | `<fieldset>` | `fc-fieldset` | `legend: React.ReactNode` — renders `<legend>` internally |
| `FileInput` | `FileInput.tsx` | `<label>` | `fc-file` | Thin wrapper around `<input type="file">`; `label?: React.ReactNode`; `accept?`; `multiple?` |
| `Footer` | `Footer.tsx` | `<footer>` | `fc-footer` | `children: React.ReactNode` |
| `Header` | `Header.tsx` | `<header>` | `fc-header` | `children: React.ReactNode` |
| `Heading` | `Heading.tsx` | `<h1>`–`<h6>` | `fc-heading` | `level: 1 \| 2 \| 3 \| 4 \| 5 \| 6` — determines element; `data-level` auto-set |
| `Hero` | `Hero.tsx` | `<section>` | `fc-hero` | `children: React.ReactNode` |
| `Icon` | `Icon.tsx` | `<span>` | `fc-icon` | `children: React.ReactNode` (SVG); `size?: 'sm' \| 'md' \| 'lg'`; `aria-hidden?` defaults `true` |
| `Image` | `Image.tsx` | `<figure>` | `fc-image` | `src: string`, `alt: string`, `caption?: React.ReactNode` — renders `<img>` + optional `<figcaption>` |
| `Label` | `Label.tsx` | `<label>` | `fc-label` | Standard `<label>` with `fc-label` class; `required?: boolean` adds `aria-required` visual indicator |
| `Link` | `Link.tsx` | `<a>` | `fc-link` | `external?: boolean` → `target="_blank" rel="noopener noreferrer"` |
| `List` | `List.tsx` | `<ul>` or `<ol>` | `fc-list` | `ordered?: boolean` — determines element; `variant?: 'default' \| 'none'` |
| `ProgressBar` | `ProgressBar.tsx` | `<div>` | `fc-progress-bar` | `value: number` (0–100), `label?: string` — sets `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `role="progressbar"` |
| `Quote` | `Quote.tsx` | `<blockquote>` | `fc-quote` | `cite?: string`, `attribution?: React.ReactNode` |
| `RadioButton` | `RadioButton.tsx` | `<label>` | `fc-radio` | Thin wrapper; renders `<input type="radio">` internally; `label?: React.ReactNode` |
| `SearchInput` | `SearchInput.tsx` | `<label>` | `fc-search-input` | Renders `<input type="search">`; `label?: string`; `onSearch?: (v: string) => void` |
| `Separator` | `Separator.tsx` | `<hr>` | `fc-separator` | `orientation?: 'horizontal' \| 'vertical'` |
| `Skeleton` | `Skeleton.tsx` | `<div>` | `fc-skeleton` | `variant?: 'text' \| 'circle' \| 'rect'`; `width?`, `height?` inline style |
| `SkipLink` | `SkipLink.tsx` | `<a>` | `fc-skip-link` | `href: string` (target id, e.g. `"#main"`) |
| `Slider` | `Slider.tsx` | `<label>` | `fc-slider` | Wraps `<input type="range">`; `label?: React.ReactNode`; `showValue?: boolean` |
| `Spinner` | `Spinner.tsx` | `<span>` | `fc-spinner` | `size?: 'sm' \| 'md' \| 'lg'`; `label?: string` → `aria-label` (default: "Loading") |
| `Table` | `Table.tsx` | `<div>` | `fc-table` | Scroll wrapper; renders `<table>` inside; `caption?: string` |
| `TextInput` | `TextInput.tsx` | `<label>` | `fc-text-input` | Wraps `<input type="text">`; `label?: React.ReactNode`; `error?: string`; `hint?: string` |
| `Textarea` | `Textarea.tsx` | `<label>` | `fc-textarea` | Wraps `<textarea>`; `label?: React.ReactNode`; `error?: string`; `hint?: string` |
| `Video` | `Video.tsx` | `<figure>` | `fc-video` | Wraps `<video>`; `caption?: React.ReactNode`; forwards all `<video>` attributes |
| `VisuallyHidden` | `VisuallyHidden.tsx` | `<span>` | `fc-visually-hidden` | Pure CSS hide; `as?: 'span' \| 'div' \| 'p'` for element override |

### 6.3 — Layout primitives

One file per row. Files live at `src/tier1/layout/<File>`. All extend `React.HTMLAttributes<HTMLDivElement>` unless noted.

| Component | File | FC class | Notable custom props |
|---|---|---|---|
| `AspectRatio` | `AspectRatio.tsx` | `fc-aspect-ratio` | `ratio?: string` (e.g. `"16/9"`) → `--fc-aspect-ratio` CSS var |
| `Box` | `Box.tsx` | `fc-box` | `padding?`, `margin?`, `borderRadius?` — map to inline `--fc-*` overrides |
| `Center` | `Center.tsx` | `fc-center` | `maxWidth?: string` → `--fc-center-max-width` |
| `Columns` | `Columns.tsx` | `fc-columns` | `columns?: number` → `--fc-columns` CSS var |
| `Container` | `Container.tsx` | `fc-container` | No custom props; breakpoint-responsive max-width via CSS |
| `Cover` | `Cover.tsx` | `fc-cover` | `minHeight?: string` → `--fc-cover-min-height` |
| `Grid` | `Grid.tsx` | `fc-grid` | `minItemWidth?: string` → `--fc-grid-min-item-width` |
| `Inline` | `Inline.tsx` | `fc-inline` | `gap?: string` → `--fc-inline-gap` |
| `Sidebar` | `Sidebar.tsx` | `fc-sidebar` | `sideWidth?: string` → `--fc-sidebar-width`; `side?: 'left' \| 'right'` |
| `Spacer` | `Spacer.tsx` | `fc-spacer` | `size?: string` → `--fc-spacer-size` |
| `Stack` | `Stack.tsx` | `fc-stack` | `gap?: string` → `--fc-stack-gap`; `as?: React.ElementType` |
| `Switcher` | `Switcher.tsx` | `fc-switcher` | `threshold?: string` → `--fc-switcher-threshold`; `limit?: number` → `--fc-switcher-limit` |

**CSS var injection pattern for layout primitives:**
```tsx
export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  gap?: string
  as?: React.ElementType
}

export function Stack({ gap, as: As = 'div', className, style, children, ref, ...props }: StackProps) {
  return (
    <As
      ref={ref}
      className={cx('fc-stack', className)}
      style={gap ? { '--fc-stack-gap': gap, ...style } : style}
      {...props}
    >
      {children}
    </As>
  )
}
```

Layout primitives that accept an `as` prop are polymorphic — the `ref` type will be `HTMLElement` (the common base), which is sufficient since layout primitives do not need fine-grained ref types.

---

## 7 — Tier 2 Component APIs

### 7.1 — Accordion

Compound component. A React context (`AccordionContext`) holds the `createAccordion` machine and is consumed by `AccordionItem`.

```tsx
// Exports: AccordionRoot, AccordionItem, AccordionTrigger, AccordionPanel

export interface AccordionRootProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]          // controlled
  onValueChange?: (v: string | string[]) => void
  className?: string
  children: React.ReactNode
}

export interface AccordionItemProps {
  value: string                      // unique identifier for this item
  className?: string
  children: React.ReactNode
}

export interface AccordionTriggerProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  children: React.ReactNode
}

export interface AccordionPanelProps {
  className?: string
  children: React.ReactNode
}
```

**Wiring:**
- `AccordionRoot` creates the machine via `useMachine(() => createAccordion({ type, onValueChange: stableCallback }))`.
- `AccordionRoot` renders `<div class="fc-accordion" data-type={type}>`.
- `AccordionItem` renders `<details class="fc-accordion__item" data-state={open?'open':'closed'}>`. It calls `machine.register({ value, detailsEl: ref.current })` in a `useEffect` and calls the returned unregister on cleanup.
- `AccordionTrigger` renders `<summary class="fc-accordion__trigger">`.
- `AccordionPanel` renders `<div class="fc-accordion__panel">`.
- Context shape: `{ machine: Accordion; registerItem(value: string, detailsEl: HTMLElement): () => void }`.

### 7.2 — Toggle

Single component. Renders as `<label class="fc-toggle">` wrapping a hidden `<input type="checkbox">` and visual track.

```tsx
export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked?: boolean                  // controlled
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: React.ReactNode            // visible text label
  disabled?: boolean
}
```

**Wiring:**
- `useMachine(() => createToggle({ defaultChecked, checked, onCheckedChange: stableCallback }))`.
- Spread `machine.getRootProps()` onto a wrapping `<label>` (adjusting `onClick` and `onKeyDown` to be no-ops since the native checkbox handles this). **Important:** The core `createToggle` machine implements `role="switch"` on a generic element. For the React component we render a native `<input type="checkbox" role="switch">` and synchronize its `checked` state with `machine.state.checked`. This gives free keyboard handling and form serialization.
- Call `machine.setChecked(e.target.checked)` in `onChange`.
- Call `machine.setRootEl(inputRef.current)` in a `useEffect`.

### 7.3 — Modal

Single root component + named slot children.

```tsx
// Exports: Modal, ModalTitle, ModalBody, ModalFooter, ModalClose

export interface ModalProps {
  open: boolean                      // always controlled — dialogs are imperative
  onClose: () => void
  className?: string
  variant?: 'default' | 'alert'
  size?: 'sm' | 'md' | 'lg' | 'full'
  closeOnBackdropClick?: boolean
  animationDuration?: number
  children: React.ReactNode
}

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  children: React.ReactNode
}

// ModalBody, ModalFooter — simple <div> wrappers with fc-modal__body / fc-modal__footer
// ModalClose — <button> that calls context.onClose(); aria-label="Close modal" default
```

**Wiring:**
- `useMachine(() => createModal(dialogRef.current!, { closeOnBackdropClick, animationDuration, onClose: stableCallback }))`.
- After machine is created, attach `dialogRef` to `<dialog>` via `ref`. The `useEffect` that creates the machine must run after the ref is attached — use a lazy initialization flag or a two-phase mount.
- **Preferred pattern:** Use a `useEffect` that calls `machine.open()` when `open` prop becomes `true`, and `machine.close()` when it becomes `false`:
  ```tsx
  useEffect(() => {
    if (open) machine.open()
    else machine.close()
  }, [open])
  ```
- Spread `machine.getRootProps()` onto `<dialog>` (merging `onAnimationEnd`).
- Provide `{ onClose }` via `ModalContext` so `ModalClose` can call it.
- Render into a portal: `createPortal(<dialog ...>, document.body)`.

### 7.4 — Popover

Compound component. `PopoverRoot` holds the machine in context.

```tsx
// Exports: PopoverRoot, PopoverTrigger, PopoverContent

export interface PopoverRootProps {
  open?: boolean                     // controlled
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: import('@floating-ui/dom').Placement
  children: React.ReactNode
}

export interface PopoverTriggerProps {
  children: React.ReactElement       // cloneElement to inject aria-expanded + onClick
  asChild?: boolean
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}
```

**Wiring:**
- `PopoverRoot` calls `useMachine(() => createPopover(triggerRef.current!, contentRef.current!, { placement, onOpenChange: stableCallback }))`.
- Refs are populated by `PopoverTrigger` and `PopoverContent` registering themselves into context on mount: `context.setTriggerEl(ref.current)`.
- `PopoverTrigger` clones its child and injects `onClick` (calls `machine.toggle()`) and `aria-expanded={machine.state.open}`.
- `PopoverContent` renders a `<div class="fc-popover" hidden={!machine.state.open}>` and injects its ref into context.
- For controlled mode: sync `open` prop → `machine.open()` / `machine.close()` via `useEffect`.

### 7.5 — FileUpload

Single component with render prop or children for customizing the drop zone appearance.

```tsx
// Exports: FileUpload

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  onError?: (error: FileUploadError) => void
  accept?: string
  maxSize?: number                   // bytes
  multiple?: boolean
  disabled?: boolean
  className?: string
  children?: React.ReactNode         // dropzone slot content
}

// FileUploadError from @web-loom/foolscap-core
```

**Wiring:**
- `useMachine(() => createFileUpload(inputRef.current!, { accept, maxSize, onFilesSelected: stableCallback, onError: stableCallback }))`.
- Call `machine.setInputEl(inputRef.current)` in a `useEffect`.
- Render:
  ```tsx
  <div {...machine.getDropzoneProps()} className={cx('fc-file-upload', className, machine.state.isDragging && 'fc-file-upload--dragging')}>
    {children ?? <span>Drop files here or click to browse</span>}
    <input ref={inputRef} {...machine.getInputProps()} hidden />
  </div>
  ```

### 7.6 — Form

Compound component. `FormRoot` creates the machine and provides a `FormContext`. `FormField` is a convenience wrapper.

```tsx
// Exports: FormRoot, FormField, useFormField

export interface FormRootProps {
  onSubmit?: (values: Record<string, string>) => void | Promise<void>
  onInvalid?: (errors: Record<string, string>) => void
  fields?: Record<string, import('@web-loom/foolscap-core').FormFieldConfig>
  className?: string
  children: React.ReactNode
}

export interface FormFieldProps {
  name: string
  label: React.ReactNode
  hint?: string
  children: React.ReactElement      // the input element
  className?: string
}

// useFormField() — consumed by children inside FormField
export function useFormField(): {
  name: string
  error: string | undefined
  'aria-invalid': boolean
  'aria-describedby': string
  onBlur: () => void
}
```

**Wiring:**
- `FormRoot` calls `useMachine(() => createForm(formRef.current!, { fields, onSubmit: stableCallback, onInvalid: stableCallback }))`.
- Spread `machine.getFormProps()` onto `<form>`.
- Provide `{ machine }` via `FormContext`.
- `FormField` reads `machine.getFieldProps(name)` and `machine.getErrorProps(name)` from context; wraps its child (the input) with a `<label>`, and renders an error message element.
- `useFormField()` reads from `FormContext` — must be used inside `FormField`.

---

## 8 — Tier 3 Component APIs

### 8.1 — Tabs

Compound component. Context holds the machine and is consumed by `TabsList`, `Tab`, and `TabPanel`.

```tsx
// Exports: TabsRoot, TabsList, Tab, TabPanel

export interface TabsRootProps {
  defaultValue?: string
  value?: string                     // controlled
  onValueChange?: (value: string) => void
  activationMode?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  variant?: 'underline' | 'contained'
  loop?: boolean
  className?: string
  children: React.ReactNode
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export interface TabProps {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export interface TabPanelProps {
  value: string
  className?: string
  children: React.ReactNode
}
```

**Wiring:**
- `TabsRoot` calls `useMachine(() => createTabs({ defaultValue, value, activationMode, orientation, loop, onValueChange: stableCallback }))`.
- `TabsRoot` renders `<div class="fc-tabs" data-variant={variant}>`.
- `TabsList` renders `<div {...machine.getTablistProps()} class="fc-tabs__tablist">`.
- `Tab` renders `<button {...machine.getTabProps(value)} class={cx('fc-tabs__tab', className)} data-state={selected ? 'active' : 'inactive'}>`.
- `TabPanel` renders `<div {...machine.getPanelProps(value)} class="fc-tabs__panel">`.
- Context shape: `{ machine: Tabs }`.

### 8.2 — Toast

`ToastProvider` creates the `Toaster` machine once at the subtree root. `useToast()` consumes it imperatively. `Toaster` renders the live region. See §9 for `useToast`.

```tsx
// Exports: ToastProvider, Toaster, ToastItem, useToast

export interface ToastProviderProps {
  limit?: number
  defaultDuration?: number
  children: React.ReactNode
}

export interface ToasterProps {
  position?: 'top' | 'top-right' | 'bottom-right' | 'bottom'
  className?: string
}

export interface ToastItemProps {
  toast: import('@web-loom/foolscap-core').Toast
  className?: string
}
```

**Wiring:**
- `ToastProvider` calls `useMachine(() => createToaster({ limit, defaultDuration }))` and provides `machine` via `ToastContext`.
- `Toaster` reads `machine` from context, subscribes via `useStore`, and renders:
  ```tsx
  <div {...machine.getRegionProps()} className={cx('fc-toast-region', positionClass, className)}>
    {machine.state.toasts.map(toast => (
      <ToastItem key={toast.id} toast={toast} />
    ))}
  </div>
  ```
- `Toaster` renders via `createPortal` into `document.body`.
- `ToastItem` renders `<div {...machine.getToastProps(toast.id)} class="fc-toast" data-type={toast.type}>`.

### 8.3 — Tooltip

Compound component. `TooltipRoot` holds the machine. `TooltipTrigger` clones its child to inject props. `TooltipContent` renders the bubble.

```tsx
// Exports: TooltipRoot, TooltipTrigger, TooltipContent

export interface TooltipRootProps {
  openDelay?: number
  closeDelay?: number
  children: React.ReactNode
}

export interface TooltipTriggerProps {
  children: React.ReactElement       // single element child; receives aria-describedby
  asChild?: boolean
}

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}
```

**Wiring:**
- `TooltipRoot` calls `useMachine(() => createTooltip(triggerRef.current!, contentRef.current!, { openDelay, closeDelay }))` — but because refs are populated by children, use the same deferred ref pattern as Popover: children register their refs into context on mount.
- `TooltipTrigger` clones its child and merges `machine.getTriggerProps()` (which includes `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`, `aria-describedby`).
- `TooltipContent` renders `<div role="tooltip" {...machine.getContentProps()} class="fc-tooltip__content">` and sets its own ref in context.

### 8.4 — Select

Compound component. `SelectRoot` holds the machine. Uses `createPortal` for the listbox to avoid overflow clipping.

```tsx
// Exports: SelectRoot, SelectTrigger, SelectContent, SelectOption

export interface SelectRootProps {
  options: import('@web-loom/foolscap-core').SelectOption[]
  value?: string                     // controlled
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  placement?: import('@floating-ui/dom').Placement
  name?: string                      // for hidden <select> form submission
  placeholder?: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children?: React.ReactNode         // override display; defaults to selected label or placeholder
}

export interface SelectContentProps {
  className?: string
}

export interface SelectOptionProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
}
```

**Wiring:**
- `SelectRoot` calls `useMachine(() => createSelect({ options, value, defaultValue, onValueChange: stableCallback, onOpenChange: stableCallback, placement }))`.
- `SelectRoot` renders a wrapper `<div class="fc-select" data-state={open ? 'open' : 'closed'}>`. It also renders a visually-hidden `<select name={name}>` kept in sync with `machine.state.value` for form serialization.
- `SelectTrigger` spreads `machine.getTriggerProps()` onto a `<button class="fc-select__trigger">`. Renders `<span class="fc-select__trigger-value">{displayValue}</span>` and a chevron icon.
- `SelectContent` renders `<ul role="listbox" {...machine.getListboxProps()} class="fc-select__listbox">` via `createPortal`. Pass `listboxRef` to `machine.setListboxEl`.
- `SelectOption` renders `<li {...machine.getOptionProps(value, index)} class="fc-select__option">`. The parent `SelectContent` needs to track option order to supply correct `index` to `getOptionProps` — use `React.Children` enumeration or a registration context.
- Context shape: `{ machine: Select; options: SelectOption[]; placeholder?: string }`.

### 8.5 — Combobox

Compound component. Similar structure to Select but with a text input instead of a trigger button.

```tsx
// Exports: ComboboxRoot, ComboboxInput, ComboboxList, ComboboxOption

export interface ComboboxRootProps {
  options: import('@web-loom/foolscap-core').ComboboxOption[]
  value?: string                     // controlled
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  filterFn?: (options: ComboboxOption[], inputValue: string) => ComboboxOption[]
  loading?: boolean
  name?: string
  placeholder?: string
  disabled?: boolean
  children: React.ReactNode
}

export interface ComboboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  className?: string
}

export interface ComboboxListProps {
  className?: string
}

export interface ComboboxOptionProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
}
```

**Wiring:**
- `ComboboxRoot` calls `useMachine(() => createCombobox({ options, value, defaultValue, filterFn, loading, onValueChange: stableCallback }))`.
- Wrap in `<div class="fc-combobox">`.
- `ComboboxInput` spreads `machine.getInputProps()` onto `<input class="fc-combobox__input">`. Pass `inputRef` to `machine.setInputEl`.
- `ComboboxList` renders `<ul {...machine.getListboxProps()} class="fc-combobox__list">` via `createPortal`.
- `ComboboxOption` renders `<li {...machine.getOptionProps(value, index)} class="fc-combobox__option">`.
- Sync `loading` prop change to `machine.setLoading(loading)` via `useEffect`.

---

## 9 — `useToast` hook

`src/hooks/useToast.ts` — imperative API. Must be called inside a `ToastProvider` subtree.

```ts
export interface UseToastReturn {
  add(toast: Omit<import('@web-loom/foolscap-core').Toast, 'id'>): string
  dismiss(id: string): void
  dismissAll(): void
  toasts: import('@web-loom/foolscap-core').Toast[]
}

export function useToast(): UseToastReturn
```

**Implementation:**
- Reads `machine` from `ToastContext`.
- Calls `useStore(machine)` to get re-renders when `state.toasts` changes (or the `Toaster` component handles rendering — `useToast` just needs `add/dismiss`).
- Returns `{ add: machine.add, dismiss: machine.dismiss, dismissAll: machine.dismissAll, toasts: machine.state.toasts }`.

**Usage pattern:**
```tsx
function App() {
  return (
    <ToastProvider limit={5} defaultDuration={4000}>
      <Toaster position="bottom-right" />
      <Page />
    </ToastProvider>
  )
}

function Page() {
  const toast = useToast()
  return (
    <button onClick={() => toast.add({ title: 'Saved!', type: 'success' })}>
      Save
    </button>
  )
}
```

---

## 10 — Source directory layout

```
packages/react/src/
├── test-setup.ts
├── hooks/
│   ├── useCallbackRef.ts
│   ├── useMachine.ts
│   ├── useStore.ts
│   └── useToast.ts
├── utils/
│   └── cx.ts
├── tier1/
│   ├── Alert.tsx
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   ├── Breadcrumbs.tsx          (exports BreadcrumbItem too)
│   ├── Button.tsx
│   ├── ButtonGroup.tsx
│   ├── Card.tsx
│   ├── Checkbox.tsx
│   ├── ColorPicker.tsx
│   ├── DateInput.tsx
│   ├── EmptyState.tsx
│   ├── Fieldset.tsx
│   ├── FileInput.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Heading.tsx
│   ├── Hero.tsx
│   ├── Icon.tsx
│   ├── Image.tsx
│   ├── Label.tsx
│   ├── Link.tsx
│   ├── List.tsx
│   ├── ProgressBar.tsx
│   ├── Quote.tsx
│   ├── RadioButton.tsx
│   ├── SearchInput.tsx
│   ├── Separator.tsx
│   ├── Skeleton.tsx
│   ├── SkipLink.tsx
│   ├── Slider.tsx
│   ├── Spinner.tsx
│   ├── Table.tsx
│   ├── TextInput.tsx
│   ├── Textarea.tsx
│   ├── Video.tsx
│   ├── VisuallyHidden.tsx
│   └── layout/
│       ├── AspectRatio.tsx
│       ├── Box.tsx
│       ├── Center.tsx
│       ├── Columns.tsx
│       ├── Container.tsx
│       ├── Cover.tsx
│       ├── Grid.tsx
│       ├── Inline.tsx
│       ├── Sidebar.tsx
│       ├── Spacer.tsx
│       ├── Stack.tsx
│       └── Switcher.tsx
├── tier2/
│   ├── Accordion.tsx            (exports AccordionRoot, AccordionItem, AccordionTrigger, AccordionPanel)
│   ├── FileUpload.tsx
│   ├── Form.tsx                 (exports FormRoot, FormField, useFormField)
│   ├── Modal.tsx                (exports Modal, ModalTitle, ModalBody, ModalFooter, ModalClose)
│   ├── Popover.tsx              (exports PopoverRoot, PopoverTrigger, PopoverContent)
│   └── Toggle.tsx
├── tier3/
│   ├── Combobox.tsx             (exports ComboboxRoot, ComboboxInput, ComboboxList, ComboboxOption)
│   ├── Select.tsx               (exports SelectRoot, SelectTrigger, SelectContent, SelectOption)
│   ├── Tabs.tsx                 (exports TabsRoot, TabsList, Tab, TabPanel)
│   ├── Toast.tsx                (exports ToastProvider, Toaster, ToastItem)
│   └── Tooltip.tsx              (exports TooltipRoot, TooltipTrigger, TooltipContent)
└── index.ts
```

---

## 11 — `src/index.ts` public surface

Export everything by name. Tree-shaking at the bundler handles dead code elimination.

```ts
// Hooks
export { useStore } from './hooks/useStore'
export { useMachine } from './hooks/useMachine'
export { useCallbackRef } from './hooks/useCallbackRef'
export { useToast } from './hooks/useToast'

// Utils
export { cx } from './utils/cx'

// Tier 1 — components
export { Alert } from './tier1/Alert'
export type { AlertProps } from './tier1/Alert'
export { Avatar } from './tier1/Avatar'
export type { AvatarProps } from './tier1/Avatar'
// ... (one export + one type export per component)

// Tier 1 — layout
export { Stack } from './tier1/layout/Stack'
export type { StackProps } from './tier1/layout/Stack'
// ... (one export + one type export per layout primitive)

// Tier 2
export { AccordionRoot, AccordionItem, AccordionTrigger, AccordionPanel } from './tier2/Accordion'
export type { AccordionRootProps, AccordionItemProps } from './tier2/Accordion'
export { FileUpload } from './tier2/FileUpload'
export type { FileUploadProps } from './tier2/FileUpload'
export { FormRoot, FormField, useFormField } from './tier2/Form'
export type { FormRootProps, FormFieldProps } from './tier2/Form'
export { Modal, ModalTitle, ModalBody, ModalFooter, ModalClose } from './tier2/Modal'
export type { ModalProps } from './tier2/Modal'
export { PopoverRoot, PopoverTrigger, PopoverContent } from './tier2/Popover'
export type { PopoverRootProps, PopoverContentProps } from './tier2/Popover'
export { Toggle } from './tier2/Toggle'
export type { ToggleProps } from './tier2/Toggle'

// Tier 3
export { TabsRoot, TabsList, Tab, TabPanel } from './tier3/Tabs'
export type { TabsRootProps, TabProps, TabPanelProps } from './tier3/Tabs'
export { ToastProvider, Toaster, ToastItem } from './tier3/Toast'
export type { ToastProviderProps, ToasterProps } from './tier3/Toast'
export { TooltipRoot, TooltipTrigger, TooltipContent } from './tier3/Tooltip'
export type { TooltipRootProps, TooltipContentProps } from './tier3/Tooltip'
export { SelectRoot, SelectTrigger, SelectContent, SelectOption } from './tier3/Select'
export type { SelectRootProps, SelectOptionProps } from './tier3/Select'
export { ComboboxRoot, ComboboxInput, ComboboxList, ComboboxOption } from './tier3/Combobox'
export type { ComboboxRootProps, ComboboxOptionProps } from './tier3/Combobox'
```

---

## 12 — Test contract

### 12.1 — Test tool chain

| Tool | Purpose |
|---|---|
| `@testing-library/react` | Render, query, act |
| `@testing-library/user-event` | Realistic keyboard/pointer events |
| `vitest` | Runner + assertions |
| `jsdom` | DOM environment (already configured) |

### 12.2 — Hook tests (`src/hooks/*.test.ts`)

**`useMachine`:**
- Creates machine on mount (factory called exactly once).
- Re-renders when machine state changes.
- Calls `machine.destroy()` on unmount.
- Does not call `destroy()` on re-render (StrictMode double-invoke does not double-destroy).

**`useStore`:**
- Returns current state + actions on first render.
- Re-renders when `subscribe` listener fires.
- Unsubscribes on unmount.

**`useToast`:**
- `add()` increments `toasts` length.
- `dismiss(id)` removes toast.
- `dismissAll()` empties list.
- Throws if called outside `ToastProvider`.

### 12.3 — Tier 1 smoke tests (`src/tier1/*.test.tsx`)

Group all 37 + 12 into one `tier1.test.tsx` file to avoid 49 small files.

For each component verify:
1. Renders without throwing.
2. `className` is merged (not replaced).
3. `ref` forwards to the root DOM element.
4. HTML snapshot for the primary variant (use `toMatchInlineSnapshot` for brevity).

```tsx
it('Button renders and forwards ref', () => {
  const ref = React.createRef<HTMLButtonElement>()
  const { getByRole } = render(<Button ref={ref}>Click</Button>)
  expect(getByRole('button')).toBeTruthy()
  expect(ref.current).toBeInstanceOf(HTMLButtonElement)
})

it('Button merges className', () => {
  const { getByRole } = render(<Button className="my-class">X</Button>)
  expect(getByRole('button').className).toContain('fc-button')
  expect(getByRole('button').className).toContain('my-class')
})
```

### 12.4 — Tier 2 tests (`src/tier2/*.test.tsx`)

One test file per component. Required tests:

**All Tier 2:**
- Renders without throwing.
- Mounts and unmounts without console errors (no listener leaks).

**Accordion:**
- Single mode: opening item B closes item A.
- Multiple mode: A and B can be open simultaneously.
- Controlled `value` prop is respected.
- `onValueChange` fires with the new open value.

**Toggle:**
- `checked` prop controls state (controlled mode).
- `defaultChecked` sets initial state (uncontrolled).
- `onCheckedChange` fires on click.
- Keyboard: Space toggles checked state.

**Modal:**
- When `open={true}`, `<dialog>` has `open` attribute.
- When `open={false}`, `<dialog>` does not have `open` attribute.
- `onClose` is called when the close button is activated.

**Popover:**
- Clicking `PopoverTrigger` opens the content.
- Content is hidden when closed.
- Escape key closes the popover.

**FileUpload:**
- Drop event with valid files calls `onFilesSelected`.
- File exceeding `maxSize` calls `onError` with `type: 'size'`.
- `isDragging` class is present during dragover.

**Form:**
- `onSubmit` called with form values on valid submit.
- `onInvalid` called when required field is empty.
- Error message is displayed after blur on invalid field.

### 12.5 — Tier 3 tests (`src/tier3/*.test.tsx`)

One test file per component. Required tests:

**Tabs:**
- Default selected tab is correct.
- Clicking a tab selects it and hides other panels.
- ArrowRight selects next tab in automatic mode.
- Manual mode: ArrowRight focuses, Enter selects.
- Controlled `value` prop is respected.
- `onValueChange` fires.

**Toast / `useToast`:**
- `add()` renders a toast in the `Toaster`.
- After `duration` ms the toast is removed (fake timers).
- `dismiss(id)` immediately removes toast.
- `aria-live` is `assertive` when an error toast is present.

**Tooltip:**
- Content is hidden on initial render.
- Hover on trigger shows content after `openDelay`.
- Mouse leave hides content after `closeDelay`.
- `aria-describedby` on trigger points to tooltip id when open.

**Select:**
- Clicking trigger opens listbox.
- ArrowDown highlights options.
- Enter selects highlighted option, closes listbox, calls `onValueChange`.
- Escape closes without selecting.
- Disabled option is skipped by keyboard navigation.
- Hidden `<select>` reflects the selected value (for form submission).

**Combobox:**
- Typing filters options.
- ArrowDown + Enter selects from filtered list.
- Input value resets to selected label on blur.
- `loading={true}` sets `aria-busy` on listbox.

---

## 13 — Acceptance criteria

- [ ] **AC-1:** `pnpm --filter @web-loom/foolscap-react build` exits 0; `dist/` contains `index.js`, `index.cjs`, `index.d.ts`.
- [ ] **AC-2:** `pnpm --filter @web-loom/foolscap-react typecheck` passes with 0 errors.
- [ ] **AC-3:** `pnpm --filter @web-loom/foolscap-react lint` passes with 0 errors.
- [ ] **AC-4:** `pnpm --filter @web-loom/foolscap-react test` passes; all tests green.
- [ ] **AC-5:** Every Tier 1 component (`render(<Foo />)`) renders without throwing and `ref` forwards to the correct DOM element.
- [ ] **AC-6:** Every Tier 1 component merges `className` without losing the `fc-*` base class.
- [ ] **AC-7:** `useMachine` factory is called exactly once per component lifecycle; `destroy()` is called exactly once on unmount.
- [ ] **AC-8:** Controlled Accordion (`value` prop) respects externally set open state.
- [ ] **AC-9:** Modal renders into a portal (`document.body` child); focus is trapped while open.
- [ ] **AC-10:** `useToast()` called outside `ToastProvider` throws with a descriptive error (not an obscure null ref crash).
- [ ] **AC-11:** `Toaster` renders into a portal at `document.body`; `aria-live` region is always in the DOM.
- [ ] **AC-12:** Select + hidden `<select>` keeps form serialization working: `FormData` from a wrapping `<form>` includes the selected value under `name`.
- [ ] **AC-13:** Bundle size check: `dist/index.js` does not include `@floating-ui/dom` source (it is an external); verified by grepping the bundle for `"computePosition"` — must not appear as inline source.
- [ ] **AC-14:** No Tier 1 component imports from `@web-loom/foolscap-core` (they are CSS-only; importing core would bloat the Tier 1 tree).
- [ ] **AC-15:** `pnpm build` at monorepo root (Turborepo) completes without errors and caches correctly on second run.

---

## 14 — Implementation notes

### 14.1 — Portal rendering

`Modal` and `Toaster` use `createPortal(content, document.body)`. Add a guard for SSR environments:

```tsx
const canUseDOM = typeof document !== 'undefined'

// Inside the component:
if (!canUseDOM) return null
return createPortal(content, document.body)
```

### 14.2 — Deferred ref init for compound components

`Popover`, `Tooltip`, `Select`, and `Combobox` need DOM refs that are only available after children mount. Do not pass `null` refs to `createXxx` eagerly — defer via a two-step mount:

```tsx
// In PopoverRoot:
const triggerRef = useRef<HTMLElement | null>(null)
const contentRef = useRef<HTMLElement | null>(null)
const [ready, setReady] = useState(false)

useEffect(() => { setReady(true) }, [])

// Machine is only created after refs are populated (children have mounted)
const machine = useMachine(
  () => ready
    ? createPopover(triggerRef.current!, contentRef.current!, opts)
    : stubMachine,  // minimal no-op stub with same shape
)
```

A simpler alternative: expose `setTriggerEl` / `setContentEl` on the machine (which `@web-loom/foolscap-core` already provides for Select and Combobox), and call them from child `useEffect`s:

```tsx
// PopoverTrigger:
useEffect(() => {
  context.machine.setTriggerEl(triggerRef.current)
  return () => context.machine.setTriggerEl(null)
}, [])
```

This is the preferred approach — match the pattern already established in `@web-loom/foolscap-core`'s Select and Combobox.

### 14.3 — React StrictMode safety

StrictMode in React 18 double-invokes effects (mount → unmount → mount) in development. The `useMachine` implementation must not destroy the machine during the unmount phase of the first mount cycle, or must recreate it cleanly on the second mount.

The implementation in §5.2 handles this: `machineRef.current` is set to `null` in the cleanup effect, and re-initialized synchronously during the next render. The key constraint: `factory()` must be side-effect free (no DOM mutations at creation time — those belong in `open()` / `activate()` methods).

### 14.4 — `data-state` mirroring convention

For CSS targeting, Tier 2/3 React components must mirror machine state to `data-state` on the root element. Examples:

- Modal root: `data-state={machine.state.status}` (`"closed"` | `"opening"` | `"open"` | `"closing"`)
- Popover content: `data-state={machine.state.open ? 'open' : 'closed'}`
- Tab: `data-state={selected ? 'active' : 'inactive'}`
- Toast: `data-type={toast.type}`

### 14.5 — Component naming for React DevTools

Since all components are plain named function declarations (`export function Foo`), React DevTools and Storybook automatically show the function name. No manual `displayName` assignment is needed. The only exception is components produced by factory calls or wrapping utilities (e.g., `React.memo(Foo)`) — in those cases, set `displayName` explicitly on the result.

### 14.6 — No inline `style` for behavior — only for layout overrides

Tier 1 layout primitives may inject CSS custom properties via `style` (e.g., `--fc-stack-gap`). All Tier 2/3 positioning (floating UI output: `left`, `top`, `position`) is applied by the core machine to the DOM element directly — the React component does not need to manage positioning styles beyond passing the ref.

### 14.7 — Test isolation

Each test file should use `afterEach(() => cleanup())` via the global setup in `test-setup.ts`. Do not share machine or store instances between tests. `vi.useFakeTimers()` / `vi.useRealTimers()` in `beforeEach`/`afterEach` for all timer-dependent tests (Toast auto-dismiss, Tooltip open/close delay).

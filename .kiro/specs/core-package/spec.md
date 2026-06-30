# Core Package

> Build `@web-loom/foolscap-core` — the headless behavior layer.
> **Phase:** 2 (2.2 → 2.4)
> **Depends on:** Monorepo scaffold complete; `@web-loom/store-core@^0.5.4` and `@floating-ui/dom@^1.6.0` installed
> **Blocks:** React adapter (Phase 3), Vue/Angular adapters (Phase 4)

---

## 1 — Overview

`@web-loom/foolscap-core` is the framework-agnostic behavior layer. It owns:

- **Interaction logic** — what happens when a user presses `ArrowDown` in a listbox, or `Escape` in a modal.
- **ARIA prop-getters** — functions that return the exact `role`, `aria-*`, `tabIndex`, and handler attributes a host element needs.
- **Focus management** — traps and roving tabindexes, shared across all frameworks.
- **Custom events** — `fc:eventname` on the relevant DOM element, with a typed `detail` payload.

The core knows nothing about React, Vue, or Angular. It manipulates state via `@web-loom/store-core` and returns plain attribute objects. Framework adapters (Phase 3–4) subscribe to state changes and spread prop-getters onto their elements.

### What this spec covers (Phase 2.2–2.4)

| Section | Content |
|---|---|
| §4 | 5 shared utility modules |
| §5 | 6 Tier-2 platform shims |
| §6 | 6 priority Tier-3 machines (Tabs, Toast, Tooltip, Select, Combobox, Modal-expanded) |
| §7 | Test contract |
| §8 | `src/index.ts` public surface |
| §9 | Acceptance criteria |

**Out of scope (Phase 2.5):** Drawer, DropdownMenu, Navigation, Carousel, Datepicker, Pagination, ProgressIndicator, Rating, SegmentedControl, Stepper, TreeView, RichTextEditor.

### Current scaffold state (do not recreate)

- `packages/core/package.json` — correct deps, scripts, exports map
- `packages/core/tsup.config.ts` — dual ESM/CJS, externals: `@web-loom/store-core`, `@floating-ui/dom`
- `packages/core/vitest.config.ts` — browser mode, Playwright/Chromium
- `packages/core/tsconfig.json` — extends `@foolscap/tsconfig/base.json`
- `packages/core/src/index.ts` — empty stub (`export {}`)

---

## 2 — `@web-loom/store-core` API reference

Every machine uses `createStore` as its reactive atom. The full type signature:

```ts
// @web-loom/store-core
function createStore<S extends Record<string, any>, A>(
  initialState: S,
  createActions: (
    set: (updater: (state: S) => S) => void,
    get: () => S,
    actions: A
  ) => A
): Store<S, A>

interface Store<S, A> {
  getState(): S
  setState(updater: (state: S) => S): void
  subscribe(listener: (newState: S, oldState: S) => void): () => void  // returns unsubscribe
  destroy(): void
  actions: A
}
```

**Key constraints from ADR-001:**
- `subscribe` returns an **unsubscribe function** `() => void` — framework adapters call it on component teardown.
- There are no built-in guards. Write `if (get().open) return` explicitly inside actions.
- No selector memoization. Prop-getters recompute on every call — acceptable, mirrors framework render cycle.
- Never import `/persist` from `@web-loom/store-core` — it must tree-shake cleanly from the core bundle.

---

## 3 — Machine return shape (standard contract)

Every `create*` function returns an object satisfying this interface. Machines may add more prop-getters but must not remove any of these.

```ts
interface MachineInstance<S> {
  readonly state: S                                      // live snapshot via getState()
  subscribe(listener: (s: S, prev: S) => void): () => void
  destroy(): void
  // ...component-specific prop-getters
}
```

**Prop-getter convention:**
- Return type is always `Record<string, unknown>` assignable to HTML element attributes.
- Keys are camelCase attribute names (`aria-selected` → `ariaSelected` is NOT used; keep kebab-case strings for HTML attribute spreading).
- Handlers (`onClick`, `onKeyDown`, etc.) are camelCase for framework adapter compatibility; in tests they are invoked directly.
- All returned attribute objects are plain, serialisable objects — no functions except event handlers.

**Custom event convention:**
- Always fire on the relevant DOM element via `element.dispatchEvent(new CustomEvent('fc:eventname', { bubbles: true, composed: true, detail: { ... } }))`.
- Event names are lowercase with hyphens: `fc:change`, `fc:open`, `fc:close`, `fc:add`, `fc:dismiss`.
- All `detail` payloads are typed (see per-machine specs below).

---

## 4 — Shared utilities (`src/utils/`)

Create these five files. They have no interdependencies and can be implemented in parallel.

### 4.1 `src/utils/id.ts`

```ts
let counter = 0

export function createId(prefix: string): string
// Returns `${prefix}-${++counter}` during normal execution.
// Returns `${prefix}-test-${counter}` when `process.env.NODE_ENV === 'test'`
// so tests get deterministic IDs without a seed option.
```

Usage: every machine calls `createId('fc-tabs')`, `createId('fc-modal')`, etc. to generate stable element IDs for ARIA relationships (`aria-controls`, `aria-labelledby`).

### 4.2 `src/utils/events.ts`

```ts
export function dispatch<T extends Record<string, unknown>>(
  element: Element,
  name: string,     // e.g. 'fc:change'
  detail: T
): void
// Fires a CustomEvent with bubbles: true, composed: true.
// Silently no-ops if element is null/undefined.
```

### 4.3 `src/utils/keyboard.ts`

```ts
// Key identity helpers
export const isArrowUp    = (e: KeyboardEvent): boolean  // e.key === 'ArrowUp'
export const isArrowDown  = (e: KeyboardEvent): boolean
export const isArrowLeft  = (e: KeyboardEvent): boolean
export const isArrowRight = (e: KeyboardEvent): boolean
export const isEnter      = (e: KeyboardEvent): boolean  // e.key === 'Enter'
export const isEscape     = (e: KeyboardEvent): boolean  // e.key === 'Escape'
export const isSpace      = (e: KeyboardEvent): boolean  // e.key === ' '
export const isTab        = (e: KeyboardEvent): boolean  // e.key === 'Tab'
export const isShiftTab   = (e: KeyboardEvent): boolean  // e.shiftKey && isTab
export const isHome       = (e: KeyboardEvent): boolean  // e.key === 'Home'
export const isEnd        = (e: KeyboardEvent): boolean  // e.key === 'End'
export const isPageUp     = (e: KeyboardEvent): boolean  // e.key === 'PageUp'
export const isPageDown   = (e: KeyboardEvent): boolean  // e.key === 'PageDown'

// Index navigation helpers
export function getNextIndex(current: number, total: number, loop?: boolean): number
// Returns (current + 1) % total when loop=true (default); clamps to total-1 otherwise.

export function getPrevIndex(current: number, total: number, loop?: boolean): number
// Returns (current - 1 + total) % total when loop=true; clamps to 0 otherwise.

// Typeahead match helper
export function getIndexByTypeahead(
  items: string[],
  char: string,
  currentIndex: number
): number
// Returns the next index whose item starts with char (case-insensitive).
// Wraps around; returns currentIndex if no match.
```

### 4.4 `src/utils/focus-trap.ts`

```ts
export interface FocusTrap {
  activate(): void
  deactivate(): void
}

export function createFocusTrap(container: HTMLElement): FocusTrap
```

**Behavior contract:**
- `activate()`: focuses the first focusable element inside `container`. Intercepts `Tab` and `Shift+Tab` on the document to keep focus within `container`. Records `document.activeElement` at activation time as `returnFocus` target.
- `deactivate()`: removes the Tab interceptor. Calls `returnFocus.focus()` if `returnFocus` is still in the document.
- Focusable element query: `'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'`
- If `container` has no focusable children, `activate()` focuses `container` itself after setting `tabIndex = -1` on it.
- Calling `deactivate()` when not active is a safe no-op.

### 4.5 `src/utils/roving-tabindex.ts`

```ts
export interface RovingTabindex {
  setActive(index: number): void
  handleKeydown(event: KeyboardEvent): void
  destroy(): void
}

export function createRovingTabindex(
  getItems: () => HTMLElement[],
  options?: {
    loop?: boolean          // default true
    orientation?: 'horizontal' | 'vertical' | 'both'  // default 'both'
    onActivate?: (index: number) => void
  }
): RovingTabindex
```

**Behavior contract:**
- Manages `tabIndex` across a dynamic list of elements: active item gets `tabIndex=0`, all others get `tabIndex=-1`.
- `setActive(index)`: sets `tabIndex=0` on item at `index`, `tabIndex=-1` on all others; calls `items[index].focus()`.
- `handleKeydown(e)`:
  - `orientation='horizontal'` or `'both'`: `ArrowRight` → next, `ArrowLeft` → prev
  - `orientation='vertical'` or `'both'`: `ArrowDown` → next, `ArrowUp` → prev
  - `Home` → first, `End` → last
  - Calls `setActive` and `e.preventDefault()` on match; ignores other keys.
- `destroy()`: resets all items to `tabIndex=0` (restores natural tab order).
- `getItems` is called lazily on each keydown so the list can be dynamic (DOM mutations).

---

## 5 — Tier-2 Shims (`src/tier2/`)

These wrap native platform elements, adding only what the platform leaves out.

### 5.1 `src/tier2/accordion.ts`

**Strategy:** `<details>/<summary>` elements do open/close natively. The shim adds single-open coordination and fires custom events.

```ts
export interface AccordionOptions {
  type?: 'single' | 'multiple'   // default 'single'
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

export interface AccordionState {
  value: string | string[]
}

export interface AccordionItem {
  value: string
  detailsEl: HTMLElement
}

export interface Accordion {
  readonly state: AccordionState
  register(item: AccordionItem): () => void   // returns unregister fn
  subscribe(listener: (s: AccordionState, prev: AccordionState) => void): () => void
  destroy(): void
}

export function createAccordion(options?: AccordionOptions): Accordion
```

**Behavior contract:**
- `register(item)`: attaches a `toggle` event listener to `item.detailsEl`. Returns an unregister function that removes the listener.
- On `toggle` event: if `type='single'` and the item opened, close all other registered items (set `detailsEl.open = false`). Update state. Call `onValueChange`. Dispatch `fc:open` or `fc:close` on the `detailsEl`.
- `destroy()`: unregisters all items.
- No prop-getters needed — the native `<details>` handles all ARIA.

### 5.2 `src/tier2/modal.ts`

**Strategy:** Wraps native `<dialog>`. The shim adds: focus trap, scroll lock, backdrop click dismiss, animation states, and focus return.

```ts
export interface ModalOptions {
  onOpen?: () => void
  onClose?: () => void
  closeOnBackdropClick?: boolean   // default true
  closeOnEscape?: boolean          // default true
}

export interface ModalState {
  status: 'closed' | 'opening' | 'open' | 'closing'
}

export interface Modal {
  readonly state: ModalState
  open(): void
  close(): void
  getRootProps(): {
    role: 'dialog'
    'aria-modal': true
    'data-state': 'closed' | 'opening' | 'open' | 'closing'
  }
  subscribe(listener: (s: ModalState, prev: ModalState) => void): () => void
  destroy(): void
}

export function createModal(dialogEl: HTMLDialogElement, options?: ModalOptions): Modal
```

**Behavior contract:**
- `open()`: sets `status='opening'`; calls `dialogEl.showModal()`; activates focus trap; adds `overflow:hidden` to `document.body`; after next animation frame sets `status='open'`. Dispatches `fc:open` on `dialogEl`. Calls `onOpen`.
- `close()`: sets `status='closing'`; calls focus-trap `deactivate()`; removes scroll lock; calls `dialogEl.close()`; sets `status='closed'`. Dispatches `fc:close` on `dialogEl`. Calls `onClose`.
- Listens for native `close` event on `dialogEl` (catches Escape key) and calls internal close logic if `status` isn't already `closed`.
- If `closeOnBackdropClick`: listens for `click` on `dialogEl`; closes if `event.target === dialogEl` (backdrop click detection: target is the dialog itself, not a child).
- `destroy()`: removes all listeners; deactivates focus trap if active.

### 5.3 `src/tier2/popover.ts`

**Strategy:** Popover API where supported (`HTMLElement.showPopover` exists); Floating UI for positioning in all cases.

```ts
import type { Placement } from '@floating-ui/dom'

export interface PopoverOptions {
  placement?: Placement   // default 'bottom'
  offset?: number         // default 8
  onOpen?: () => void
  onClose?: () => void
}

export interface PopoverState {
  open: boolean
}

export interface Popover {
  readonly state: PopoverState
  open(): void
  close(): void
  toggle(): void
  getTriggerProps(): {
    'aria-expanded': boolean
    'aria-controls': string
    onClick(): void
  }
  getContentProps(): {
    id: string
    role: 'dialog'
    'data-state': 'open' | 'closed'
    hidden: boolean
  }
  subscribe(listener: (s: PopoverState, prev: PopoverState) => void): () => void
  destroy(): void
}

export function createPopover(
  triggerEl: HTMLElement,
  contentEl: HTMLElement,
  options?: PopoverOptions
): Popover
```

**Behavior contract:**
- Generates a stable `contentId` via `createId('fc-popover')` for `aria-controls`/`id` pairing.
- `open()`: sets state `open=true`; calls `computePosition` from `@floating-ui/dom` with `[offset(options.offset), flip(), shift()]` middleware; applies computed `top`/`left` to `contentEl.style`; sets `contentEl.hidden = false`. If Popover API supported (`'showPopover' in contentEl`), also calls `contentEl.showPopover()`. Dispatches `fc:open`.
- `close()`: sets `open=false`; sets `contentEl.hidden = true`. Dispatches `fc:close`.
- Listens for `Escape` keydown on document while open → calls `close()` and returns focus to `triggerEl`.
- Listens for `pointerdown` outside `contentEl` and `triggerEl` while open → calls `close()`.
- `destroy()`: removes all listeners; cleans up Floating UI.

### 5.4 `src/tier2/file-upload.ts`

```ts
export interface FileUploadOptions {
  accept?: string
  multiple?: boolean
  maxSize?: number     // bytes; enforced client-side
  onFilesSelected?: (files: File[]) => void
  onError?: (error: FileUploadError) => void
}

export type FileUploadError =
  | { type: 'size'; file: File; maxSize: number }
  | { type: 'type'; file: File; accept: string }

export interface FileUploadState {
  isDragging: boolean
  files: File[]
}

export interface FileUpload {
  readonly state: FileUploadState
  getDropzoneProps(): {
    role: 'button'
    tabIndex: 0
    'aria-label': string
    onDragEnter(e: DragEvent): void
    onDragLeave(e: DragEvent): void
    onDragOver(e: DragEvent): void
    onDrop(e: DragEvent): void
    onClick(): void
  }
  getInputProps(): {
    type: 'file'
    hidden: true
    accept: string | undefined
    multiple: boolean | undefined
    onChange(e: Event): void
  }
  subscribe(listener: (s: FileUploadState, prev: FileUploadState) => void): () => void
  destroy(): void
}

export function createFileUpload(
  inputEl: HTMLInputElement,
  options?: FileUploadOptions
): FileUpload
```

**Behavior contract:**
- `getDropzoneProps().onClick()`: programmatically calls `inputEl.click()`.
- `onDragEnter/Over`: set `isDragging=true`; call `e.preventDefault()`.
- `onDragLeave`: set `isDragging=false` only if `e.relatedTarget` is outside the dropzone.
- `onDrop`: set `isDragging=false`; collect `e.dataTransfer.files`; validate each against `accept` and `maxSize`; dispatch `fc:files-selected` with valid files; call `onError` for invalid files.
- `getInputProps().onChange`: reads `inputEl.files`, validates, dispatches `fc:files-selected`.

### 5.5 `src/tier2/toggle.ts`

```ts
export interface ToggleOptions {
  defaultChecked?: boolean
  checked?: boolean       // controlled mode
  onCheckedChange?: (checked: boolean) => void
}

export interface ToggleState {
  checked: boolean
}

export interface Toggle {
  readonly state: ToggleState
  setChecked(checked: boolean): void
  getRootProps(): {
    role: 'switch'
    'aria-checked': boolean
    tabIndex: 0
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  subscribe(listener: (s: ToggleState, prev: ToggleState) => void): () => void
  destroy(): void
}

export function createToggle(options?: ToggleOptions): Toggle
```

**Behavior contract:**
- `getRootProps().onClick()`: toggles `checked`; calls `onCheckedChange`; dispatches `fc:change` with `{ checked }`.
- `getRootProps().onKeyDown(e)`: `Space` or `Enter` → same as `onClick`; calls `e.preventDefault()`.
- Controlled mode: when `options.checked` is defined, state always mirrors it; `setChecked` still calls `onCheckedChange` but the caller is responsible for re-providing the value.

### 5.6 `src/tier2/form.ts`

```ts
export interface FieldConfig {
  required?: boolean
  validate?: (value: string) => string | null   // returns error message or null
}

export interface FormOptions {
  fields?: Record<string, FieldConfig>
  onSubmit?: (values: Record<string, string>) => void | Promise<void>
  onInvalid?: (errors: Record<string, string>) => void
}

export interface FormState {
  errors: Record<string, string>
  isSubmitting: boolean
  touched: Record<string, boolean>
}

export interface Form {
  readonly state: FormState
  getFieldProps(name: string): {
    name: string
    'aria-invalid': boolean
    'aria-describedby': string   // `${name}-error`
    onBlur(): void
  }
  getErrorProps(name: string): {
    id: string                   // `${name}-error`
    role: 'alert'
    hidden: boolean
  }
  getFormProps(): {
    noValidate: true
    onSubmit(e: SubmitEvent): void
  }
  setError(name: string, message: string): void
  clearError(name: string): void
  subscribe(listener: (s: FormState, prev: FormState) => void): () => void
  destroy(): void
}

export function createForm(
  formEl: HTMLFormElement,
  options?: FormOptions
): Form
```

**Behavior contract:**
- `getFormProps().onSubmit(e)`: calls `e.preventDefault()`; sets `isSubmitting=true`; iterates configured fields, running `validate` and checking `required`; if any errors, sets them, calls `onInvalid`, dispatches `fc:invalid`, sets `isSubmitting=false`; otherwise calls `onSubmit(values)` and awaits; after resolution sets `isSubmitting=false`; dispatches `fc:submit`.
- `getFieldProps(name).onBlur()`: marks `touched[name]=true`; runs validation for that field; sets or clears error.
- `getErrorProps(name).hidden`: `true` when no error for `name`.

---

## 6 — Priority Tier-3 Machines (`src/tier3/`)

These are the highest-value components per PRD §18. Each is a full behavior machine over `@web-loom/store-core`.

### 6.1 `src/tier3/tabs.ts`

**ARIA pattern:** [APG Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

```ts
export interface TabsOptions {
  defaultValue?: string
  value?: string            // controlled
  activationMode?: 'automatic' | 'manual'   // default 'automatic'
  orientation?: 'horizontal' | 'vertical'   // default 'horizontal'
  loop?: boolean                            // default true
  onValueChange?: (value: string) => void
}

export interface TabsState {
  value: string
  focusedValue: string   // may differ from value in 'manual' mode
}

export interface Tabs {
  readonly state: TabsState
  getTablistProps(): {
    role: 'tablist'
    'aria-orientation': 'horizontal' | 'vertical'
  }
  getTabProps(value: string): {
    role: 'tab'
    id: string                  // `${id}-tab-${value}`
    'aria-selected': boolean
    'aria-controls': string     // `${id}-panel-${value}`
    tabIndex: 0 | -1
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getPanelProps(value: string): {
    role: 'tabpanel'
    id: string                  // `${id}-panel-${value}`
    'aria-labelledby': string   // `${id}-tab-${value}`
    hidden: boolean
  }
  subscribe(listener: (s: TabsState, prev: TabsState) => void): () => void
  destroy(): void
}

export function createTabs(options?: TabsOptions): Tabs
```

**Keyboard table:**

| Key | Effect |
|---|---|
| `ArrowRight` / `ArrowDown` | Focus next tab (wraps if `loop`) |
| `ArrowLeft` / `ArrowUp` | Focus previous tab |
| `Home` | Focus first tab |
| `End` | Focus last tab |
| `Enter` / `Space` | Select focused tab (manual mode only) |
| `Tab` | Move focus to active panel (not caught — browser default) |

**Behavior contract:**
- `automatic` mode: focus and select happen together on arrow keys. `focusedValue` always equals `value`.
- `manual` mode: arrow keys move `focusedValue` without changing `value`. `Enter`/`Space` confirms selection.
- `getTabProps(value).tabIndex`: `0` if `value === state.value`, else `-1`.
- `onValueChange` fires only when `value` actually changes.
- Dispatches `fc:change` with `{ value }` on the tablist element when value changes. Requires a `tablistEl` reference — pass it at construction time or lazily; see implementation note below.

**Implementation note:** `getTablistProps()` can return an `onRef` callback or the machine can accept `tablistEl?: HTMLElement` as an option. The simplest approach is to accept `tablistEl` in options (optional) and dispatch there. Tests pass a real `<div role="tablist">`.

### 6.2 `src/tier3/toast.ts`

**ARIA pattern:** Live region `aria-live="assertive"` for important toasts; `aria-live="polite"` for informational.

```ts
export interface ToastOptions {
  limit?: number           // max simultaneous toasts; default 5
  defaultDuration?: number // ms; default 5000; 0 = never auto-dismiss
  onAdd?: (toast: Toast) => void
  onDismiss?: (id: string) => void
}

export interface Toast {
  id: string
  title: string
  description?: string
  type?: 'info' | 'success' | 'warning' | 'error'   // default 'info'
  duration?: number    // overrides defaultDuration; 0 = persistent
  action?: { label: string; onClick: () => void }
}

export interface ToasterState {
  toasts: Toast[]
}

export interface Toaster {
  readonly state: ToasterState
  add(toast: Omit<Toast, 'id'>): string   // returns generated id
  dismiss(id: string): void
  dismissAll(): void
  getRegionProps(): {
    role: 'region'
    'aria-label': string
    'aria-live': 'assertive' | 'polite'
    'aria-atomic': false
  }
  getToastProps(id: string): {
    role: 'status'
    'aria-atomic': true
    'data-state': 'visible' | 'dismissed'
  }
  getDismissButtonProps(id: string): {
    'aria-label': string
    onClick(): void
  }
  subscribe(listener: (s: ToasterState, prev: ToasterState) => void): () => void
  destroy(): void
}

export function createToaster(options?: ToastOptions): Toaster
```

**Behavior contract:**
- `add(toast)`: generates an `id` via `createId('fc-toast')`; prepends to `state.toasts`; if `toasts.length > limit`, drops the oldest. Starts a timer for `duration` ms (or `defaultDuration`). Dispatches `fc:add` with the full toast object. Returns `id`.
- `dismiss(id)`: removes from `state.toasts`; clears its timer. Dispatches `fc:dismiss` with `{ id }`. Calls `onDismiss`.
- `dismissAll()`: dismisses all toasts.
- `getRegionProps()['aria-live']`: `'assertive'` when any current toast has `type='error'`; `'polite'` otherwise.
- Timers pause while the user has a pointer over the region (add `onPointerEnter`/`onPointerLeave` props on `getRegionProps()` to pause/resume timers). Add these handlers to `getRegionProps()`.
- `destroy()`: clears all timers.

### 6.3 `src/tier3/tooltip.ts`

**ARIA pattern:** `role="tooltip"` + `aria-describedby` on trigger.

```ts
export interface TooltipOptions {
  openDelay?: number    // ms; default 600
  closeDelay?: number   // ms; default 300
  placement?: Placement // Floating UI; default 'top'
  offset?: number       // default 8
  onOpen?: () => void
  onClose?: () => void
}

export interface TooltipState {
  open: boolean
}

export interface Tooltip {
  readonly state: TooltipState
  open(): void
  close(): void
  getTriggerProps(): {
    'aria-describedby': string   // tooltipId when open, else undefined
    onMouseEnter(): void
    onMouseLeave(): void
    onFocus(): void
    onBlur(): void
  }
  getContentProps(): {
    id: string           // tooltipId
    role: 'tooltip'
    'data-state': 'open' | 'closed'
    hidden: boolean
  }
  subscribe(listener: (s: TooltipState, prev: TooltipState) => void): () => void
  destroy(): void
}

export function createTooltip(
  triggerEl: HTMLElement,
  contentEl: HTMLElement,
  options?: TooltipOptions
): Tooltip
```

**Behavior contract:**
- `onMouseEnter` / `onFocus`: clear close timer; start open timer (`openDelay` ms). If already open, cancel timers and stay open.
- `onMouseLeave` / `onBlur`: clear open timer; start close timer (`closeDelay` ms).
- `open()` (when timer fires): position `contentEl` with Floating UI `computePosition([offset(options.offset), flip(), shift()])`; apply `top`/`left` to `contentEl.style`; set `open=true`. Dispatches `fc:open`.
- `close()`: set `open=false`; clear timers. Dispatches `fc:close`.
- `getTriggerProps()['aria-describedby']`: the tooltip `id` when `open=true`, `undefined` otherwise.
- `destroy()`: clears all timers; removes event listeners.

### 6.4 `src/tier3/select.ts`

**ARIA pattern:** [APG Combobox / Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) — custom listbox variant.

```ts
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectOptions {
  options: SelectOption[]
  defaultValue?: string
  value?: string           // controlled
  placement?: Placement    // Floating UI; default 'bottom-start'
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
}

export interface SelectState {
  open: boolean
  value: string
  highlightedIndex: number   // -1 = nothing highlighted
}

export interface Select {
  readonly state: SelectState
  openMenu(): void
  closeMenu(): void
  selectOption(value: string): void
  getTriggerProps(): {
    role: 'combobox'
    'aria-expanded': boolean
    'aria-haspopup': 'listbox'
    'aria-controls': string      // listboxId
    'aria-activedescendant': string | undefined  // id of highlighted option
    tabIndex: 0
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getListboxProps(): {
    id: string          // listboxId
    role: 'listbox'
    'aria-label': string
    hidden: boolean
    onKeyDown(e: KeyboardEvent): void
  }
  getOptionProps(value: string, index: number): {
    id: string         // `${listboxId}-option-${index}`
    role: 'option'
    'aria-selected': boolean
    'aria-disabled': boolean
    'data-highlighted': boolean
    onClick(): void
    onMouseMove(): void
  }
  subscribe(listener: (s: SelectState, prev: SelectState) => void): () => void
  destroy(): void
}

export function createSelect(options: SelectOptions): Select
```

**Keyboard table (trigger focused):**

| Key | Effect |
|---|---|
| `Space` / `Enter` / `ArrowDown` / `ArrowUp` | Opens menu; highlights first/last option |
| `Escape` | Closes menu; returns focus to trigger |

**Keyboard table (listbox open):**

| Key | Effect |
|---|---|
| `ArrowDown` | Highlight next option |
| `ArrowUp` | Highlight previous option |
| `Home` | Highlight first option |
| `End` | Highlight last option |
| `Enter` / `Space` | Select highlighted option; close menu |
| `Escape` | Close menu; return focus to trigger |
| Printable char | Typeahead — highlight matching option |

**Behavior contract:**
- Skip disabled options in keyboard navigation.
- `selectOption(value)`: updates `state.value`; closes menu; calls `onValueChange`; dispatches `fc:change` with `{ value }` on trigger element.
- `getOptionProps(value).onMouseMove()`: sets `highlightedIndex` without firing `onValueChange`.
- Floating UI: position listbox on `openMenu()` using `computePosition([offset(4), flip(), size()])`.
- `destroy()`: removes event listeners; resets Floating UI cleanup.

### 6.5 `src/tier3/combobox.ts`

Extends Select with text input filtering. Reuses the same ARIA listbox pattern.

```ts
export interface ComboboxOptions extends Omit<SelectOptions, 'placement'> {
  filterFn?: (option: SelectOption, inputValue: string) => boolean
  // default: option.label.toLowerCase().includes(inputValue.toLowerCase())
  loading?: boolean
  placement?: Placement   // default 'bottom-start'
}

export interface ComboboxState extends SelectState {
  inputValue: string
  loading: boolean
  filteredOptions: SelectOption[]
}

export interface Combobox {
  readonly state: ComboboxState
  openMenu(): void
  closeMenu(): void
  selectOption(value: string): void
  setInputValue(value: string): void
  setLoading(loading: boolean): void
  getInputProps(): {
    role: 'combobox'
    'aria-expanded': boolean
    'aria-haspopup': 'listbox'
    'aria-controls': string
    'aria-activedescendant': string | undefined
    'aria-autocomplete': 'list'
    value: string
    onInput(e: Event): void
    onKeyDown(e: KeyboardEvent): void
    onFocus(): void
    onBlur(): void
  }
  getListboxProps(): {
    id: string
    role: 'listbox'
    hidden: boolean
    onKeyDown(e: KeyboardEvent): void
  }
  getOptionProps(value: string, index: number): ReturnType<Select['getOptionProps']>
  subscribe(listener: (s: ComboboxState, prev: ComboboxState) => void): () => void
  destroy(): void
}

export function createCombobox(options: ComboboxOptions): Combobox
```

**Behavior contract (differences from Select):**
- `getInputProps().onInput(e)`: reads `(e.target as HTMLInputElement).value`; calls `setInputValue`; opens menu; recomputes `filteredOptions` by applying `filterFn` to `options`.
- `getInputProps().onFocus()`: opens menu if `filteredOptions.length > 0`.
- `getInputProps().onBlur()`: after a short delay (150ms, allowing click on option to fire first), close menu and reset `inputValue` to the selected option's label (or empty if none).
- `state.filteredOptions` is the list to render — always a subset of `options`.
- When `loading=true`, `getListboxProps()` adds `aria-busy: true`.
- Keyboard behaviour identical to Select, but operates on `filteredOptions`.
- `selectOption(value)`: in addition to Select behavior, sets `inputValue` to the selected option's `label`.

### 6.6 `src/tier3/modal.ts` (Tier-3 expansion)

This is the full version of `src/tier2/modal.ts` with animation state support. Replace Tier-2 `modal.ts` with this version and re-export the same `createModal` symbol. (No breaking change — same function signature, same return type, extra state transitions.)

```ts
// Identical to Tier-2 spec above (§5.2) plus:
export interface ModalOptions {
  // same as §5.2, plus:
  animationDuration?: number  // ms to wait before status transitions open→opening and closing→closed; default 200
}

// State is already defined with 'opening' | 'open' | 'closing' | 'closed' in §5.2.
// The Tier-3 version commits to the full animation cycle:
// open()  → 'opening' (next frame) → 'open'
// close() → 'closing' (wait animationDuration ms) → 'closed'
```

**Additional behavior:**
- `getRootProps()` now also includes `onAnimationEnd(): void` — when called with `status='opening'`, transitions to `'open'`; when called with `status='closing'`, calls `dialogEl.close()` and transitions to `'closed'`. Framework adapters should attach this to the dialog's `animationend` event. The `animationDuration` timer is a fallback for environments without CSS animations.

---

## 7 — Test contract

### 7.1 Test environment

- All tests in `src/**/*.test.ts` run in **Playwright/Chromium** browser mode (already configured in `vitest.config.ts`).
- Tests must NOT use jsdom or Node.js DOM emulation. Real browser APIs are required because:
  - `<dialog>.showModal()` is not implemented in jsdom.
  - `document.activeElement` and focus management require a real browsing context.
  - The Popover API (`HTMLElement.showPopover`) requires Chromium.

### 7.2 Test utilities

Create `src/utils/test-helpers.ts` (test-only, not exported from `index.ts`):

```ts
// Renders a minimal HTML fixture into document.body and returns cleanup function.
export function fixture(html: string): {
  container: HTMLElement
  cleanup: () => void
}

// Fires a keyboard event on a target element.
export function press(target: Element, key: string, options?: KeyboardEventInit): void
```

### 7.3 Per-module test requirements

Every test file must cover the following cases.

**Utilities (`src/utils/*.test.ts`):**

| File | Tests |
|---|---|
| `id.test.ts` | Generates unique IDs; prefix is preserved; counter increments across calls |
| `keyboard.test.ts` | Each key helper returns true/false correctly; `getNextIndex` wraps/clamps; `getPrevIndex` wraps/clamps; typeahead finds next matching index |
| `focus-trap.test.ts` | Tab stays inside container; Shift+Tab stays inside container; `deactivate` returns focus to trigger; safe to call `deactivate` when not active |
| `roving-tabindex.test.ts` | `setActive` sets tabIndex=0 on target, -1 on others, calls focus(); ArrowRight moves forward; ArrowLeft moves backward; Home/End jump to first/last; `destroy` resets all to tabIndex=0 |

**Tier-2 shims (`src/tier2/*.test.ts`):**

| Component | Required tests |
|---|---|
| `accordion.test.ts` | `type='single'`: opening one item closes others; `type='multiple'`: all stay open; custom events fire |
| `modal.test.ts` | `open()` calls `showModal()`; focus is trapped inside; `Escape` closes; backdrop click closes (when enabled); focus returns to trigger on close; `destroy` removes listeners |
| `popover.test.ts` | `open()` positions content and removes `hidden`; `Escape` closes; click outside closes; `aria-expanded` reflects state |
| `file-upload.test.ts` | Drop event reads files; validates maxSize; validates accept type; `fc:files-selected` fires with valid files only |
| `toggle.test.ts` | Click toggles checked; Space/Enter toggles; `aria-checked` matches state; `onCheckedChange` called with new value |
| `form.test.ts` | Required field fails validation; custom validate fn is called; `aria-invalid` set on errored fields; `fc:submit` fires on valid submit; `fc:invalid` fires on invalid submit |

**Tier-3 machines (`src/tier3/*.test.ts`):**

| Component | Required tests |
|---|---|
| `tabs.test.ts` | Initial value renders correct tab as selected; ArrowRight/ArrowLeft moves focus; automatic mode: focus = selection; manual mode: Enter/Space confirms selection; `getPanelProps(v).hidden` is false only for selected value; `fc:change` fires with correct value |
| `toast.test.ts` | `add()` returns id and adds to state; limit is respected (oldest dropped); timer fires and dismisses; `dismissAll()` empties state; `fc:add` and `fc:dismiss` fire; `getRegionProps()['aria-live']` is 'assertive' for error type |
| `tooltip.test.ts` | Opens after `openDelay`; closes after `closeDelay`; focus triggers open; blur closes; `aria-describedby` set on trigger when open; Floating UI positions content element |
| `select.test.ts` | Closed by default; click opens; ArrowDown highlights next; Enter selects; Escape closes; typeahead selects by first char; disabled option is skipped; `fc:change` fires; controlled value is respected |
| `combobox.test.ts` | Input filters options; selecting option sets inputValue to label; blur with no selection restores label; `loading=true` adds `aria-busy`; all Select keyboard behaviors work on filtered list |
| `modal.test.ts` (tier3) | All Tier-2 modal tests pass; `status` transitions through `opening→open` on open; `closing→closed` on close; `onAnimationEnd` triggers correct transitions |

### 7.4 Accessibility tests

Each interactive component's test file must include one axe-core check:

```ts
import { checkA11y } from 'axe-vitest'
// or equivalent axe integration

it('has no accessibility violations', async () => {
  // render the component in its default state
  await checkA11y(container)
})
```

If `axe-vitest` is not available in the project, use `axe-core` directly:
```ts
import axe from 'axe-core'
const results = await axe.run(container)
expect(results.violations).toEqual([])
```

---

## 8 — Source directory layout

Produce this exact structure under `packages/core/src/`:

```
src/
├── utils/
│   ├── id.ts
│   ├── events.ts
│   ├── keyboard.ts
│   ├── focus-trap.ts
│   ├── roving-tabindex.ts
│   └── test-helpers.ts          ← test utility, NOT exported from index.ts
├── tier2/
│   ├── accordion.ts
│   ├── modal.ts                 ← superseded by tier3/modal.ts — do not export from here
│   ├── popover.ts
│   ├── file-upload.ts
│   ├── toggle.ts
│   └── form.ts
├── tier3/
│   ├── tabs.ts
│   ├── toast.ts
│   ├── tooltip.ts
│   ├── select.ts
│   ├── combobox.ts
│   └── modal.ts                 ← full animation version; replaces tier2/modal.ts
└── index.ts                     ← public API; re-exports only from here
```

### 8.1 `src/index.ts` exports

```ts
// Utils (public — adapters and consumers may need them)
export { createId } from './utils/id'
export { dispatch } from './utils/events'
export { createFocusTrap } from './utils/focus-trap'
export { createRovingTabindex } from './utils/roving-tabindex'
export * from './utils/keyboard'

// Tier 2
export { createAccordion } from './tier2/accordion'
export { createPopover } from './tier2/popover'
export { createFileUpload } from './tier2/file-upload'
export { createToggle } from './tier2/toggle'
export { createForm } from './tier2/form'

// Tier 3 (also covers modal)
export { createModal } from './tier3/modal'
export { createTabs } from './tier3/tabs'
export { createToaster } from './tier3/toast'
export { createTooltip } from './tier3/tooltip'
export { createSelect } from './tier3/select'
export { createCombobox } from './tier3/combobox'

// Type exports
export type {
  // accordion
  AccordionOptions, AccordionState, AccordionItem, Accordion,
  // modal
  ModalOptions, ModalState, Modal,
  // popover
  PopoverOptions, PopoverState, Popover,
  // file-upload
  FileUploadOptions, FileUploadState, FileUploadError, FileUpload,
  // toggle
  ToggleOptions, ToggleState, Toggle,
  // form
  FormOptions, FormState, Form, FieldConfig,
  // tabs
  TabsOptions, TabsState, Tabs,
  // toast
  ToastOptions, ToasterState, Toaster, Toast,
  // tooltip
  TooltipOptions, TooltipState, Tooltip,
  // select
  SelectOptions, SelectState, Select, SelectOption,
  // combobox
  ComboboxOptions, ComboboxState, Combobox,
} from './index'  // re-export from same barrel; adjust paths as needed
```

---

## 9 — Acceptance criteria

All of the following must pass before this spec is considered done.

### Build

- [ ] `pnpm --filter @web-loom/foolscap-core build` exits 0
- [ ] `dist/index.js` and `dist/index.cjs` both exist
- [ ] `dist/index.d.ts` exists and contains all exported type names
- [ ] Neither `dist/index.js` nor `dist/index.cjs` contains the string `LocalStorageAdapter`, `IndexedDBAdapter`, or `MemoryAdapter` (persistence adapters must tree-shake out)

### Type-check

- [ ] `pnpm --filter @web-loom/foolscap-core typecheck` exits 0 (strict TypeScript, no `any`)

### Tests

- [ ] `pnpm --filter @web-loom/foolscap-core test` passes all test files in browser mode
- [ ] Focus trap tests: Tab and Shift+Tab are contained; focus returns to trigger on deactivate
- [ ] Tabs machine: `automatic` and `manual` activation modes both tested
- [ ] Modal tests: `showModal()` is called; `status` transitions through `opening → open` and `closing → closed`
- [ ] Toast: auto-dismiss timer fires within `duration + 100ms` tolerance in browser
- [ ] Select: typeahead finds the correct option by first character
- [ ] Combobox: filter reduces `filteredOptions` in state correctly

### API surface

- [ ] All `create*` functions are exported from `src/index.ts`
- [ ] All option and state types are exported
- [ ] `test-helpers.ts` is NOT exported (internal test utility only)
- [ ] No function in `src/` imports from `@web-loom/store-core/persist`

### Custom events

- [ ] Every machine dispatches its documented `fc:*` events with the correct `detail` shape
- [ ] Events bubble (`bubbles: true`)

### Accessibility

- [ ] axe-core scan passes on each interactive component's default-rendered state
- [ ] `<dialog>` instances use `showModal()` (not `show()`) so `aria-modal` is implicit
- [ ] Tabs: panels have `aria-labelledby` pointing to their tab; tabs have `aria-controls` pointing to their panel
- [ ] Select/Combobox: `aria-activedescendant` on trigger/input tracks highlighted option

---

## 10 — Implementation notes

### Store usage pattern

```ts
// Canonical pattern for every machine:
import { createStore } from '@web-loom/store-core'
import { createId } from '../utils/id'
import { dispatch } from '../utils/events'

export function createTabs(options: TabsOptions = {}): Tabs {
  const id = createId('fc-tabs')
  const store = createStore(
    {
      value: options.defaultValue ?? '',
      focusedValue: options.defaultValue ?? '',
    },
    (set, get) => ({
      select(value: string) {
        if (get().value === value) return
        set(s => ({ ...s, value, focusedValue: value }))
        options.onValueChange?.(value)
      },
      focus(value: string) {
        set(s => ({ ...s, focusedValue: value }))
      },
    })
  )

  // Machines keep a reference to registered DOM elements for event dispatch.
  // Pass tablistEl as option or accept it later via a setTablistEl method.

  return {
    get state() { return store.getState() },
    subscribe: store.subscribe.bind(store),
    destroy: store.destroy.bind(store),
    getTablistProps() { /* ... */ },
    getTabProps(value) { /* ... */ },
    getPanelProps(value) { /* ... */ },
  }
}
```

### Floating UI usage

```ts
import { computePosition, offset, flip, shift, size } from '@floating-ui/dom'

async function position(
  referenceEl: HTMLElement,
  floatingEl: HTMLElement,
  placement: Placement,
  offsetPx: number
) {
  const { x, y } = await computePosition(referenceEl, floatingEl, {
    placement,
    middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
  })
  Object.assign(floatingEl.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
  })
}
```

### No persistence imports

```ts
// ✅ Allowed
import { createStore } from '@web-loom/store-core'

// ❌ Never allowed in this package
import { LocalStorageAdapter } from '@web-loom/store-core/persist'
```

### Controlled vs uncontrolled

For machines with `value` and `defaultValue` options:
- If `options.value` is defined at construction time, the machine treats it as **controlled**: `select()` still calls `onValueChange` and updates internal state for prop-getter computation, but the caller is responsible for re-providing the value. The simplest correct implementation is to always use `options.value ?? store.getState().value` in prop-getters when `options.value` is defined.
- If only `defaultValue` is provided (or neither), the machine is **uncontrolled** — it manages its own value.

---

## 11 — Out of scope (Phase 2.5)

The following Tier-3 machines are explicitly deferred to Phase 2.5. Do not implement or stub them in this phase:

Drawer · DropdownMenu · Navigation · Carousel · Datepicker · Pagination · ProgressIndicator · Rating · SegmentedControl · Stepper · TreeView · RichTextEditor

When Phase 2.5 executes, it will use `createFocusTrap`, `createRovingTabindex`, and the keyboard utilities from this spec as building blocks.

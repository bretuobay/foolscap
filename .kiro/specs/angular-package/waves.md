# Angular adapter — work waves

Execution plan for [`.kiro/specs/angular-package/spec.md`](./spec.md). Each wave is a reviewable slice. Do not start a later wave until the previous wave’s exit criteria pass, except where noted as parallelizable.

Inventory is the **current Vue public surface** (~37 Tier 1 families, 5 Tier 2, 18 Tier 3).

---

## Why waves

Same reason as Vue: Tier 1 is volume (host class + attrs). Tier 2/3 is skill (machines, refs, DI, body portals). Wave 0 must exist before any component. Wave 2 proves the binding model on the smallest machines. Wave 3 copies that model onto the original priority Tier 3 set. Wave 4 is the long tail. Wave 5 is Storybook, started after Wave 1 so visuals exist early.

---

## Wave 0 — Adapter foundation

**Goal:** Angular package can build (ng-packagr), typecheck, test, and host one dummy machine subscriber.

**Work:**

1. Replace tsup with ng-packagr + Angular 19 compiler. Add `foolscap-css`, `foolscap-tokens`, Analog Vitest plugin, Testing Library Angular.
2. Vitest setup file (TestBed + zone).
3. Copy `cx` from Vue; add unit tests.
4. Implement `injectStableCallback`, `injectMachine`, `injectSubscription`.
5. Tests for `injectMachine` lifecycle (create once, subscribe marks for check, destroy on teardown).

**Exit:** `pnpm --filter @web-loom/foolscap-angular` `build`, `typecheck`, `lint`, `test` all green with binding tests only.

---

## Wave 1 — Tier 1 presentational

**Goal:** Every CSS-only Vue wrapper has an Angular twin. No core imports.

### 1A — Primitives

Button, Badge, Alert, Avatar (+ AvatarGroup), Heading, Icon, Link, Separator, Spinner, Skeleton, VisuallyHidden, Label.

### 1B — Native form controls

TextInput, Textarea, Checkbox, RadioButton, SearchInput, DateInput, Slider, ColorPicker, File, Fieldset.

### 1C — Content and structure

Card (+ parts), Image, Quote, List, ProgressBar, SkipLink, Video (+ VideoEmbed), Table, EmptyState, Breadcrumbs (+ BreadcrumbItem), ButtonGroup, Stack.

### 1D — Page chrome

Header (+ parts), Footer (+ parts), Hero (+ parts).

**Exit:** grouped Tier 1 smoke tests. `index.ts` exports all Wave 1 symbols. No `@web-loom/foolscap-core` in `tier1/`.

---

## Wave 2 — Tier 2 shims (binding-model proof)

Order: Toggle → Accordion → FileUpload → Popover → Form.

**Stop-the-line:** if Toggle + Accordion are awkward, fix `injectMachine` / ref timing before Popover.

---

## Wave 3 — Priority Tier 3

Order: Tabs → Tooltip → Modal → Toast → Select → Combobox.

---

## Wave 4 — Remaining Tier 3

Suggested order: Drawer → DropdownMenu → Pagination → SegmentedControl → Rating → Stepper → ProgressIndicator → Navigation → Datepicker → Carousel → TreeView → RichTextEditor.

**Exit:** Every symbol in `packages/vue/src/index.ts` has an Angular counterpart. Package-level AC-1–AC-11 pass.

---

## Wave 5 — Angular Storybook

**Goal:** Visual and docs parity. New `apps/storybook-angular` using `@analogjs/storybook-angular` (Vite). Do not mix Angular into the React or Vue Storybook apps.

| Slice | When | Work |
|---|---|---|
| 5A | After Wave 1 | App scaffold, CSS preview, all Tier 1 stories, root scripts `storybook:angular` (port **6008**) |
| 5B | After Wave 2 | Tier 2 stories |
| 5C | After Wave 3–4 | Remaining stories |

Port story titles and variants from `apps/storybook-vue/stories`. Reuse `@web-loom/foolscap-css`.

---

## Parallelism

| Can run in parallel | Cannot |
|---|---|
| Wave 1 batches after 1A lands the host-selector pattern | Wave 1 before Wave 0 |
| Wave 5A after Wave 1 | Wave 2/3 before Wave 0 |
| Wave 4 families after Wave 3 Select/Combobox prove getter-refs + body portal | Changing core/CSS “for Angular” without a React/Vue-side need |

---

## Suggested first implementation session

1. Wave 0.
2. Wave 1A–1D.
3. Wave 5A Storybook so Tier 1 is visible.
4. Stop before Accordion until Wave 0–1 tests exist.

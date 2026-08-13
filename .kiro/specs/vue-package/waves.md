# Vue adapter — work waves

Execution plan for [`.kiro/specs/vue-package/spec.md`](./spec.md). Each wave is a reviewable slice. Do not start a later wave until the previous wave’s exit criteria pass, except where noted as parallelizable.

Inventory is the **current React public surface** (~37 Tier 1 families, 5 Tier 2, 18 Tier 3). That is the 60-component gallery plus compound parts, not 50 independent one-file ports.

---

## Why waves

Tier 1 is volume (CSS class + attrs). Tier 2/3 is skill (machines, refs, provide/inject, Teleport). Mixing them early hides whether the composable layer is wrong. Wave 0 must exist before any component. Wave 2 proves the binding model on the smallest machines. Wave 3 copies that model onto the original priority Tier 3 set. Wave 4 is the long tail.

---

## Wave 0 — Adapter foundation

**Goal:** Vue package can build, typecheck, test, and host one dummy machine subscriber.

**Work:**

1. Package.json: add `foolscap-css`, `foolscap-tokens`, Vue test libraries (see spec §2).
2. Vitest setup file + include `*.test.ts`.
3. Copy `cx` from React; add unit tests.
4. Implement `useStableCallback`, `useMachine`, `useSubscription`.
5. Tests for `useMachine` lifecycle (create once, subscribe re-renders, destroy on unmount).

**Exit:** `pnpm --filter @web-loom/foolscap-vue` `build`, `typecheck`, `lint`, `test` all green with composable tests only.

**Estimate:** small. Do this first, alone.

---

## Wave 1 — Tier 1 presentational

**Goal:** Every CSS-only React wrapper has a Vue twin. No core imports.

Split into four batches so PRs stay reviewable. Batches can be sequential PRs or parallel after Button/Alert prove the `h()` pattern.

### 1A — Primitives

Button, Badge, Alert, Avatar (+ AvatarGroup), Heading, Icon, Link, Separator, Spinner, Skeleton, VisuallyHidden, Label.

**Why first:** smallest DOM, establishes `inheritAttrs`, `cx`, named slots (`iconStart`/`iconEnd`).

### 1B — Native form controls

TextInput, Textarea, Checkbox, RadioButton, SearchInput, DateInput, Slider, ColorPicker, File, Fieldset.

**Why together:** same native-element + `data-size` / `data-state` pattern.

### 1C — Content and structure

Card (+ parts), Image, Quote, List, ProgressBar, SkipLink, Video (+ VideoEmbed), Table, EmptyState, Breadcrumbs (+ BreadcrumbItem), ButtonGroup, Stack.

### 1D — Page chrome

Header (+ parts), Footer (+ parts), Hero (+ parts).

**Exit:** grouped Tier 1 smoke tests (render + class merge + snapshot). `index.ts` exports all Wave 1 symbols. No `@web-loom/foolscap-core` in `tier1/`.

**Estimate:** largest file count, lowest difficulty. Most of the “50+ components” live here.

---

## Wave 2 — Tier 2 shims (binding-model proof)

**Goal:** Prove `useMachine` + provide/inject + DOM registration against real core factories.

Order matters:

1. **Toggle** — single component, native checkbox, controlled/uncontrolled.
2. **Accordion** — compound + `register(detailsEl)` on mount.
3. **FileUpload** — input ref + dropzone prop-getters.
4. **Popover** — `cloneVNode` trigger + Floating UI via core.
5. **Form** — deferred `<form>` el, context, submit/invalid.

**Exit:** Ported assertions from `packages/react/src/tier2/*.test.tsx` pass. Unmount does not leak listeners.

**Stop-the-line:** if Toggle + Accordion are awkward, fix composables / ref timing before Popover. Do not proceed to Wave 3 with a broken registration pattern.

---

## Wave 3 — Priority Tier 3

**Goal:** The original Phase 2.4 machines, bound the same way React binds them.

Order:

1. **Tabs** — compound, no portal, clean keyboard. Best second proof after Accordion.
2. **Tooltip** — cloneVNode + delay timers (reuse Popover lessons).
3. **Modal** — `<dialog>`, focus trap in core, Teleport, controlled `open`.
4. **Toast** — provider + `useToast` + Teleport region.
5. **Select** — getter-style options/value refs (copy React Select), Teleport listbox, hidden native `<select>`.
6. **Combobox** — Select + input filtering.

**Exit:** Ported React tests pass for all six. `useToast()` throws outside provider. Select hidden native select still serializes into `FormData`.

---

## Wave 4 — Remaining Tier 3

**Goal:** Full React parity for interactive components.

Same pattern as Wave 3; each family is its own PR if needed:

| Cluster | Components | Notes |
|---|---|---|
| Overlays | Drawer, DropdownMenu | Teleport + focus; DropdownMenu trigger clone |
| Temporal / nav | Datepicker, Navigation, Pagination | Datepicker is the heaviest calendar UI |
| Inputs | SegmentedControl, Rating, Stepper | Mostly roving tabindex already in core |
| Structure | ProgressIndicator, TreeView | TreeView registration of nested items |
| Media / edit | Carousel, RichTextEditor | RTE is the highest-risk leftover |

**Suggested PR order:** Drawer → DropdownMenu → Pagination → SegmentedControl → Rating → Stepper → ProgressIndicator → Navigation → Datepicker → Carousel → TreeView → RichTextEditor.

**Exit:** Every symbol in `packages/react/src/index.ts` has a Vue counterpart. Package-level AC-1–AC-11 in the spec pass.

---

## Wave 5 — Vue Storybook (after package parity)

**Goal:** Visual and docs parity. **Out of Wave 0–4.** The existing app is `@storybook/react-vite`; do not mix Vue into it.

**Work (later spec):** new `apps/storybook-vue` (or composed Storybook) using `@storybook/vue3-vite`. Port stories from `apps/storybook/stories/*.stories.tsx`. Reuse the same CSS import.

Playwright visual tests can follow the React storybook-playwright spec once the Vue Storybook exists.

---

## Parallelism

| Can run in parallel | Cannot |
|---|---|
| Wave 1 batches after 1A lands the pattern | Wave 1 before Wave 0 |
| Wave 4 families after Wave 3 Select/Combobox prove getter-refs + Teleport | Wave 2/3 before Wave 0 |
| Angular spike notes during Wave 1 | Changing core/CSS “for Vue” without a React-side need |
| | Vue Storybook before the components exist |

---

## Suggested first implementation session

1. Wave 0 (composables + `cx` + package deps).
2. Wave 1A through Button + Alert + Badge only, to validate `h()` ergonomics.
3. Pause: if `h()` is too noisy, consider Vue JSX via tsup **without** changing the public API. Then continue 1A–1D.

Do not start Accordion until Wave 0 tests exist.

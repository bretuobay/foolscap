# Foolscap — Implementation Guide

> Stage-by-stage build plan for the Foolscap design system.  
> Each task is scoped for a single coding agent session.  
> Phases are dependency-ordered; tasks within a phase can be parallelised unless marked `(sequential)`.

| Reference docs | |
|---|---|
| PRD | `research-docs/PRD.md` |
| Component specs | `.kiro/specs/*/spec.md` |
| Component inventory | `research-docs/components.md` |
| Interaction patterns | `research-docs/interaction-patterns.md` |

---

## Phase 0 — Foundations

**Outcome:** Monorepo boots, tokens compile to CSS custom properties, visual language locked.  
**Blocks:** Everything else.

---

### 0.1 — Monorepo scaffold `(sequential)`

Create the root Turborepo + pnpm workspace. No package code yet — structure and config only.

**Tasks:**

- [ ] Init root `package.json` with `"private": true`, pnpm engine constraint (`>=9`), and workspace scripts: `build`, `dev`, `test`, `lint`, `typecheck`
- [ ] Create `pnpm-workspace.yaml`:
  ```yaml
  packages:
    - 'packages/*'
    - 'apps/*'
    - 'tooling/*'
  ```
- [ ] Create `turbo.json` with pipeline:
  ```json
  {
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
      "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
      "dev":   { "cache": false, "persistent": true },
      "test":  { "dependsOn": ["^build"] },
      "lint":  {},
      "typecheck": { "dependsOn": ["^build"] }
    }
  }
  ```
- [ ] Create `tooling/typescript/` package (`@foolscap/tsconfig`):
  - `base.json` — strict TS, ESM, `bundler` module resolution
  - `package.json` (private, no main)
- [ ] Create `tooling/vite/` package (`@foolscap/vite-config`):
  - `index.ts` — shared `defineConfig` factory for library mode packages
  - `package.json` (private)
- [ ] Create `tooling/eslint/` package (`@foolscap/eslint-config`):
  - `index.js` — TypeScript + import rules; no framework rules (those go in adapter packages)
  - `package.json` (private)
- [ ] Create empty placeholder `package.json` stubs for all six packages (no src yet):
  - `packages/tokens/` → `@web-loom/foolscap-tokens`
  - `packages/css/` → `@web-loom/foolscap-css`
  - `packages/core/` → `@web-loom/foolscap-core`
  - `packages/react/` → `@web-loom/foolscap-react`
  - `packages/vue/` → `@web-loom/foolscap-vue`
  - `packages/angular/` → `@web-loom/foolscap-angular`
- [ ] Create `apps/playground/` — bare Vite app (no framework yet; used for manual CSS testing in Phase 1)
- [ ] `pnpm install` passes; `turbo build` exits cleanly with no-op

---

### 0.2 — `@web-loom/foolscap-tokens` package

Compile W3C Design Token JSON → CSS custom properties and TypeScript token name exports.

**Tech:** Style Dictionary v4 (or a small custom PostCSS/JS pipeline if Style Dictionary adds too much complexity).

**Tasks:**

- [ ] Scaffold `packages/tokens/src/` with token JSON files:

  **`palette.tokens.json`**
  ```json
  {
    "paper":       { "$value": "#FBFBF9", "$type": "color" },
    "paper-raised":{ "$value": "#FFFFFF",  "$type": "color" },
    "ink":         { "$value": "#1A1A1A",  "$type": "color" },
    "ink-muted":   { "$value": "#5C5C5C",  "$type": "color" },
    "grey-100":    { "$value": "#F5F5F5",  "$type": "color" },
    "grey-200":    { "$value": "#E5E5E5",  "$type": "color" },
    "grey-300":    { "$value": "#D4D4D4",  "$type": "color" },
    "grey-400":    { "$value": "#A3A3A3",  "$type": "color" },
    "grey-500":    { "$value": "#737373",  "$type": "color" },
    "grey-600":    { "$value": "#525252",  "$type": "color" },
    "grey-700":    { "$value": "#404040",  "$type": "color" },
    "grey-800":    { "$value": "#262626",  "$type": "color" },
    "grey-900":    { "$value": "#171717",  "$type": "color" }
  }
  ```

  **`spacing.tokens.json`** — 4px base, T-shirt scale: `space-1`…`space-16`  
  (`space-1`=0.25rem, `space-2`=0.5rem, `space-3`=0.75rem, `space-4`=1rem, `space-6`=1.5rem, `space-8`=2rem, `space-12`=3rem, `space-16`=4rem)

  **`typography.tokens.json`** — fluid type scale via `clamp()`:
  - `font-sans`: system-ui sans stack (override with serif recommendation in docs)
  - `font-serif`: Georgia, serif (editorial default)
  - `font-mono`: ui-monospace stack
  - `text-xs` … `text-5xl`: `clamp()` values (min/ideal/max)
  - `leading-tight` (1.25) · `leading-normal` (1.5) · `leading-relaxed` (1.75)
  - `font-normal` (400) · `font-medium` (500) · `font-semibold` (600) · `font-bold` (700)

  **`motion.tokens.json`**
  - `duration-fast`: 120ms
  - `duration-base`: 200ms
  - `easing-standard`: `cubic-bezier(0.4, 0, 0.2, 1)`
  - `easing-enter`: `cubic-bezier(0, 0, 0.2, 1)`
  - `easing-exit`: `cubic-bezier(0.4, 0, 1, 1)`

  **`radius.tokens.json`**
  - `radius-sm`: 2px · `radius-md`: 4px · `radius-lg`: 8px · `radius-full`: 9999px

  **`shadow.tokens.json`** — hairline only, no heavy drops:
  - `shadow-hairline`: `0 0 0 1px var(--fc-ink)` at 10% opacity
  - `shadow-raised`: `0 1px 3px rgba(0,0,0,0.08)`

- [ ] Build pipeline outputs:
  - `dist/tokens.css` — all tokens as `--fc-*` CSS custom properties on `:root`
  - `dist/tokens.js` / `dist/tokens.d.ts` — typed `const` exports of token names (for use in TS-side code)
- [ ] Add `"exports"` in `package.json`:
  ```json
  {
    ".": "./dist/tokens.js",
    "./css": "./dist/tokens.css"
  }
  ```
- [ ] Write Vitest tests:
  - Assert `tokens.css` contains `--fc-paper: #FBFBF9`
  - Assert `tokens.js` exports match the JSON source
  - Assert no token in `tokens.css` has a hard-coded value that should be a reference to another token

---

## Phase 1 — Classless skin (`@web-loom/foolscap-css`)

**Outcome:** A single droppable `foolscap.css` makes raw semantic HTML look finished; per-component CSS files available for tree-shaking.  
**Blocks:** Phase 3 (React adapter needs the CSS). Phase 2 can run in parallel.

---

### 1.1 — Package scaffold + PostCSS pipeline

- [ ] `packages/css/package.json` — `devDependencies`: `postcss`, `postcss-nesting`, `autoprefixer`, `cssnano`; `peerDependencies`: none
- [ ] PostCSS config: nesting → autoprefix → minify (prod only)
- [ ] Vite library mode builds two outputs:
  - `dist/foolscap.css` — single combined file (classless + all components)
  - `dist/components/[name].css` — per-component split
- [ ] `src/` structure:
  ```
  src/
  ├── tokens.css          ← @import from @web-loom/foolscap-tokens/css
  ├── reset.css           ← minimal reset
  ├── classless/
  │   ├── base.css
  │   ├── typography.css
  │   ├── forms.css
  │   ├── tables.css
  │   ├── media.css
  │   └── layout.css
  ├── components/
  │   └── [one file per component]
  └── index.css           ← @import everything
  ```

---

### 1.2 — Classless layer

Style semantic HTML elements directly (no classes). An agent should produce `src/classless/*.css`.

**Reference:** PRD §9.2, PRD §8 (visual language), token values from Phase 0.2.

- [ ] **`reset.css`** — margin reset, `box-sizing: border-box`, `line-height` from token, ink/paper on `:root`
- [ ] **`typography.css`** — `h1`–`h6` using fluid type scale tokens; `p`, `strong`, `em`, `small`, `code`, `pre`, `blockquote`, `cite`, `abbr`, `kbd`
- [ ] **`forms.css`** — `input`, `textarea`, `select`, `button`, `label`, `fieldset`, `legend`, `output` — paper surface, ink border, focus ring using `--fc-ink`
- [ ] **`tables.css`** — `table`, `thead`, `tbody`, `tr`, `th`, `td` — hairline borders, zebra stripe via `--fc-grey-100`
- [ ] **`media.css`** — `img`, `video`, `figure`, `figcaption` — max-width 100%, object-fit cover default
- [ ] **`layout.css`** — `body`, `main`, `section`, `article`, `nav`, `header`, `footer`, `aside` — Stack gap applied to direct children of block containers; `main` gets Container width

---

### 1.3 — Tier 1 component CSS (37 components)

One CSS file per component under `src/components/`. Use the spec at `.kiro/specs/[name]/spec.md` for class names, tokens, and states.

**Naming convention:** `.fc-[component]`, `.fc-[component]__[part]`, `data-state`, `data-variant`, `data-size`.

**Batch A — Typography & display:**
- [ ] `heading.css` — `.fc-heading`; `data-size` maps h1–h6 scale
- [ ] `label.css` — `.fc-label`; required indicator `::after`
- [ ] `link.css` — `.fc-link`; external affordance via `[target="_blank"]::after`
- [ ] `badge.css` — `.fc-badge`; variants: `default`, `outline`, `subtle`
- [ ] `quote.css` — `.fc-quote`; pull-quote variant via `data-variant="pull"`
- [ ] `list.css` — `.fc-list`; variants: `bulleted`, `numbered`, `plain`
- [ ] `separator.css` — `.fc-separator`; horizontal/vertical

**Batch B — Feedback & status:**
- [ ] `alert.css` — `.fc-alert`; variants: `info`, `success`, `warning`, `error`
- [ ] `spinner.css` — `.fc-spinner`; CSS keyframe animation; respects `prefers-reduced-motion`
- [ ] `skeleton.css` — `.fc-skeleton`; grey shimmer animation; `aria-hidden`
- [ ] `progress-bar.css` — `.fc-progress-bar` wrapping native `<progress>`
- [ ] `empty-state.css` — `.fc-empty-state`; icon + title + description layout

**Batch C — Actions:**
- [ ] `button.css` — `.fc-button`; variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`; `data-state="loading"`
- [ ] `button-group.css` — `.fc-button-group`; joined borders trick
- [ ] `skip-link.css` — `.fc-skip-link`; visually hidden until `:focus`

**Batch D — Form inputs:**
- [ ] `text-input.css` — `.fc-text-input`; states: default, focus, error, success, disabled
- [ ] `textarea.css` — `.fc-textarea`; auto-grow note in spec
- [ ] `search-input.css` — `.fc-search-input`; clear button slot
- [ ] `checkbox.css` — `.fc-checkbox`; indeterminate state
- [ ] `radio-button.css` — `.fc-radio-button`
- [ ] `date-input.css` — `.fc-date-input`; native `input[type=date]` styled
- [ ] `color-picker.css` — `.fc-color-picker`; native `input[type=color]` + swatch
- [ ] `slider.css` — `.fc-slider`; native `input[type=range]` styled; custom thumb
- [ ] `fieldset.css` — `.fc-fieldset`; styled `<fieldset>`/`<legend>`
- [ ] `file.css` — `.fc-file`; visual file chip (name, size, remove)

**Batch E — Content & layout:**
- [ ] `card.css` — `.fc-card`; parts: root, header, body, footer, media
- [ ] `avatar.css` — `.fc-avatar`; image + initials fallback
- [ ] `icon.css` — `.fc-icon`; `aria-hidden` default; sized via `data-size`
- [ ] `image.css` — `.fc-image`; wraps `<img>` with aspect ratio
- [ ] `table.css` — `.fc-table`; `aria-sort` states; responsive scroll wrapper
- [ ] `hero.css` — `.fc-hero`; layout primitive composition
- [ ] `header.css` — `.fc-header`; parts: root, brand, nav, actions
- [ ] `footer.css` — `.fc-footer`; parts: root, nav, legal
- [ ] `visually-hidden.css` — `.fc-visually-hidden`; clip-path technique

**Batch F — Utility & loading:**
- [ ] `breadcrumbs.css` — `.fc-breadcrumbs`; chevron separators via CSS
- [ ] `video.css` — `.fc-video`; native `<video>` + custom controls slot

---

### 1.4 — Layout primitive CSS (12 primitives)

Under `src/components/layout/`. Reference `.kiro/specs/layout/*/spec.md`.

- [ ] `box.css` — padding + border via tokens
- [ ] `stack.css` — `flex-direction: column` + `gap`; classless auto-applied to `main`, `section`, `article`
- [ ] `inline.css` — `flex-wrap: wrap` + `gap` (cluster pattern)
- [ ] `grid.css` — CSS Grid `auto-fill`/`auto-fit`; `--fc-grid-min` column token
- [ ] `columns.css` — named column sizes via tokens
- [ ] `sidebar.css` — Grid `minmax(0,1fr)` + fixed sidebar; wraps below `--fc-sidebar-threshold`
- [ ] `switcher.css` — Flex → stacks below `--fc-switcher-threshold`
- [ ] `center.css` — `max-width` + `margin-inline: auto` for reading-width content
- [ ] `cover.css` — full-height flex column; centered child gets `margin-block: auto`; `100svh`
- [ ] `container.css` — page-width wrapper; `clamp()` fluid padding; `data-size` variants
- [ ] `aspect-ratio.css` — `aspect-ratio` property; `object-fit` on media child
- [ ] `spacer.css` — explicit spacing escape hatch; `aria-hidden`; block + inline axes

---

### 1.5 — CDN bundle + lint rule

- [ ] Build `dist/foolscap.css` combining: tokens + reset + classless + all components
- [ ] Write PostCSS lint plugin (or Stylelint rule) that fails if any component CSS file contains a hard-coded colour, size, or spacing value that should reference a `--fc-*` token
- [ ] Write snapshot tests: render each component's HTML markup (from spec) and diff against stored CSS output

---

## Phase 2 — Core behaviors (`@web-loom/foolscap-core`)

**Outcome:** All Tier 2 shims and Tier 3 machines implemented and browser-tested.  
**Can run in parallel with Phase 1.**

---

### 2.1 — Package scaffold

- [ ] `packages/core/package.json`:
  ```json
  {
    "name": "@web-loom/foolscap-core",
    "dependencies": {
      "@web-loom/store-core": "^0.5.4",
      "@floating-ui/dom": "^1.x"
    }
  }
  ```
- [ ] Vite library mode; single entry `src/index.ts` re-exporting all `create*` functions
- [ ] Vitest config: `browser: { enabled: true, name: 'chromium' }` (Playwright provider)
- [ ] `src/` structure:
  ```
  src/
  ├── utils/
  │   ├── focus-trap.ts
  │   ├── roving-tabindex.ts
  │   ├── id.ts
  │   ├── events.ts
  │   └── keyboard.ts
  ├── tier2/
  │   ├── accordion.ts
  │   ├── modal.ts
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
  │   ├── drawer.ts
  │   ├── dropdown-menu.ts
  │   ├── navigation.ts
  │   ├── carousel.ts
  │   ├── datepicker.ts
  │   ├── pagination.ts
  │   ├── progress-indicator.ts
  │   ├── rating.ts
  │   ├── segmented-control.ts
  │   ├── stepper.ts
  │   ├── tree-view.ts
  │   └── rich-text-editor.ts
  └── index.ts
  ```

---

### 2.2 — Shared utilities

These underpin every machine. Write and test independently.

- [ ] **`utils/id.ts`** — `createId(prefix)` → `prefix-[nanoid]`; deterministic in tests via seed option
- [ ] **`utils/events.ts`** — `dispatch(el, name, detail)` fires `new CustomEvent('fc:[name]', { bubbles: true, detail })`
- [ ] **`utils/keyboard.ts`** — helpers: `isArrowKey`, `isEnter`, `isEscape`, `isSpace`, `isTab`, `isHome`, `isEnd`; `getNextIndex(current, total, loop)`, `getPrevIndex`
- [ ] **`utils/focus-trap.ts`** — `createFocusTrap(containerEl)` → `{ activate(), deactivate() }`; traps Tab/Shift+Tab within container; restores focus to trigger on deactivate
- [ ] **`utils/roving-tabindex.ts`** — `createRovingTabindex(items: HTMLElement[], options)` → `{ setActive(index), handleKeydown(e) }`; manages `tabIndex=0/-1` across a set of elements

---

### 2.3 — Tier 2 shims

Reference each spec at `.kiro/specs/[name]/spec.md` for the full behavior contract.

- [ ] **`accordion.ts`** — `createAccordion(options)`: coordinates multiple `<details>` for single-open mode; emits `fc:open`, `fc:close`
- [ ] **`modal.ts`** — `createModal(options)`: wraps native `<dialog>`; adds focus trap; emits `fc:open`, `fc:close`; handles `Escape` and backdrop click dismiss
- [ ] **`popover.ts`** — `createPopover(options)`: Popover API where supported; Floating UI fallback for positioning; `placement` option
- [ ] **`file-upload.ts`** — `createFileUpload(options)`: drag-enter/leave/drop events on drop zone; delegates to native `<input type="file">`; emits `fc:files-selected`
- [ ] **`toggle.ts`** — `createToggle(options)`: wraps `<input type="checkbox">`; exposes `role="switch"` prop-getter; emits `fc:change`
- [ ] **`form.ts`** — `createForm(options)`: tracks field validity states; exposes `getFieldProps(name)` (aria-invalid, aria-describedby); emits `fc:submit`, `fc:invalid`

---

### 2.4 — Tier 3 machines (Priority batch — Phase 2 scope)

These are the highest-value components per PRD §18. Implement in this order.

**For each machine: write the machine → write browser tests → export from `src/index.ts`.**

- [ ] **`tabs.ts`** — `createTabs(options)`: roving tabindex on tab list; `automatic`/`manual` activation modes; `getTablistProps()`, `getTabProps(value)`, `getPanelProps(value)`; emits `fc:change`
- [ ] **`toast.ts`** — `createToaster(options)`: toast queue with configurable `limit`; per-toast timers (pause on hover); `aria-live="assertive"` region; `getRegionProps()`, `add()`, `dismiss()`, `dismissAll()`; emits `fc:add`, `fc:dismiss`
- [ ] **`tooltip.ts`** — `createTooltip(options)`: hover/focus intent with configurable `openDelay`/`closeDelay`; Floating UI positioning; `getTriggerProps()`, `getContentProps()`; emits `fc:open`, `fc:close`
- [ ] **`select.ts`** — `createSelect(options)`: custom APG listbox; keyboard navigation (Arrow, Home, End, typeahead); Floating UI for dropdown; native `<select>` fallback export; controlled + uncontrolled modes
- [ ] **`combobox.ts`** — `createCombobox(options)`: extends select with text filter; `filterFn` option; async loading state; `getInputProps()`, `getListboxProps()`, `getOptionProps(value)`
- [ ] **`modal.ts`** — already done in 2.3 but expand: animation state (`data-state="opening|open|closing|closed"`), return focus to trigger, scroll lock

---

### 2.5 — Tier 3 machines (Remaining batch)

- [ ] **`drawer.ts`** — focus trap; `position` option (`left|right|top|bottom`); dismiss on backdrop + Escape; animation states
- [ ] **`dropdown-menu.ts`** — APG `menu` pattern; sub-menu support; Floating UI; keyboard: Arrow, Home, End, typeahead, Escape closes and returns focus
- [ ] **`navigation.ts`** — disclosure nav menus; APG `navigation` landmark; responsive collapse state (mobile menu open/closed)
- [ ] **`carousel.ts`** — scroll-snap container; roving tabindex on slides; prev/next controls; auto-play with pause-on-hover; respects `prefers-reduced-motion`
- [ ] **`datepicker.ts`** — calendar grid; keyboard date navigation (Arrow, Page Up/Down for month, Home/End for week); `min`/`max` date constraints; `isDateDisabled` option
- [ ] **`pagination.ts`** — page state; `total`, `pageSize`, `page` options; `getPageProps(n)`, `getPrevProps()`, `getNextProps()`
- [ ] **`progress-indicator.ts`** — `createProgressIndicator(options)`: step list state; `linear`/`nonLinear` mode; `getStepProps(index)`, `getConnectorProps(index)`
- [ ] **`rating.ts`** — radio-group semantics; keyboard (Arrow keys); read-only mode; half-star option
- [ ] **`segmented-control.ts`** — `role="radiogroup"` semantics; roving tabindex; emits `fc:change`
- [ ] **`stepper.ts`** (numeric) — `role="spinbutton"`; min/max/step bounds; keyboard: Arrow up/down, Page up/down (×10), Home/End
- [ ] **`tree-view.ts`** — APG `tree` pattern; keyboard expand/collapse (Arrow Right/Left); selection (Enter/Space); multi-select mode; `getTreeProps()`, `getNodeProps(id)`, `getGroupProps(id)`
- [ ] **`rich-text-editor.ts`** — `contenteditable` wrapper; toolbar commands: bold, italic, underline, strikethrough, ordered list, unordered list, link, heading level; `getEditorProps()`, `getToolbarProps()`, `exec(command)`

---

### 2.6 — Core tests

- [ ] Each machine has a co-located `*.test.ts` file
- [ ] Every test file covers:
  - Initial state matches `defaultValue` / options
  - Prop-getters return correct ARIA attributes for each state
  - Keyboard interactions produce correct state transitions (use `userEvent` or `fireEvent`)
  - Custom events are emitted with correct payloads
  - `destroy()` removes listeners and does not throw
- [ ] Focus trap tests: Tab does not leave the container while trap is active; deactivation restores focus to trigger
- [ ] axe accessibility scan on rendered HTML for each component

---

## Phase 3 — React adapter (`@web-loom/foolscap-react`)

**Outcome:** All 60 components + layout primitives available as typed React components.  
**Blocks:** Phase 4.

---

### 3.1 — Package scaffold

- [ ] `packages/react/package.json`:
  ```json
  {
    "name": "@web-loom/foolscap-react",
    "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
    "dependencies": {
      "@web-loom/foolscap-core": "workspace:*",
      "@web-loom/foolscap-css": "workspace:*",
      "@web-loom/foolscap-tokens": "workspace:*"
    }
  }
  ```
- [ ] Vite React + TypeScript; library mode; exports map with `"."`, `"./[component]"` subpaths
- [ ] `apps/playground/` updated to include React harness

---

### 3.2 — Core binding hook

- [ ] **`src/hooks/useStore.ts`** — `useStore(store)` → `[state, actions]`; subscribes on mount, unsubscribes on unmount
- [ ] **`src/hooks/useMachine.ts`** — `useMachine(createFn, options)` → machine instance; creates on mount, calls `destroy()` on unmount; returns stable `{ state, ...propGetters }`

---

### 3.3 — Tier 1 React components

Thin wrappers: forward the class, spread remaining props, merge Foolscap classnames. No behavior.

- [ ] One component file per Tier 1 spec (37 components + 12 layout primitives)
- [ ] Each exports a typed `Props` interface extending the relevant HTML element's attributes
- [ ] Each uses `forwardRef`
- [ ] Example pattern:
  ```tsx
  export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
      <button
        ref={ref}
        data-variant={variant}
        data-size={size}
        className={cx('fc-button', className)}
        {...props}
      />
    )
  )
  ```

---

### 3.4 — Tier 2 React components

Use `useMachine` to bind core shims.

- [ ] `Accordion` — wraps `<details>/<summary>`; `createAccordion` handles multi-instance coordination
- [ ] `Modal` — wraps `<dialog>`; `open` prop + `onClose` callback
- [ ] `Popover` — `PopoverTrigger` + `PopoverContent`; `placement` prop
- [ ] `FileUpload` — drop zone + input; `onFilesSelected` callback
- [ ] `Toggle` — `checked` + `onCheckedChange` props; `role="switch"` on underlying input
- [ ] `Form` — `onSubmit` + validation helpers; `FormField` child component with error display

---

### 3.5 — Tier 3 React components

Use `useMachine`. Expose idiomatic React APIs (controlled/uncontrolled, event callbacks).

- [ ] `Tabs`, `TabList`, `Tab`, `TabPanel`
- [ ] `Toast` / `Toaster` — `useToast()` hook for programmatic add/dismiss
- [ ] `Tooltip`, `TooltipTrigger`, `TooltipContent`
- [ ] `Select`, `SelectTrigger`, `SelectContent`, `SelectOption`
- [ ] `Combobox`, `ComboboxInput`, `ComboboxList`, `ComboboxOption`
- [ ] `Drawer`, `DrawerTrigger`, `DrawerContent`
- [ ] `DropdownMenu`, `DropdownTrigger`, `DropdownContent`, `DropdownItem`
- [ ] `Navigation`, `NavItem`, `NavMenu`
- [ ] `Carousel`, `CarouselSlide`, `CarouselPrev`, `CarouselNext`
- [ ] `Datepicker`, `DatepickerInput`, `DatepickerCalendar`
- [ ] `Pagination`
- [ ] `ProgressIndicator`, `Step`, `StepConnector`
- [ ] `Rating`
- [ ] `SegmentedControl`, `Segment`
- [ ] `Stepper` (numeric)
- [ ] `TreeView`, `TreeNode`
- [ ] `RichTextEditor`, `EditorToolbar`

---

### 3.6 — React-specific tests

- [ ] Smoke tests: each component renders without throwing
- [ ] Controlled mode: prop changes update the rendered output
- [ ] Uncontrolled mode: internal state updates propagate to callbacks
- [ ] Keyboard tests (using `@testing-library/user-event`)
- [ ] `useMachine` cleanup: machine is destroyed on unmount (no listener leaks)

---

## Phase 4 — Vue + Angular adapters

**Outcome:** Full component parity in Vue 3 and Angular 17+.  
**Can begin after Phase 2 is complete; does not depend on Phase 3.**

---

### 4.1 — `@web-loom/foolscap-vue`

Same structure as Phase 3 but using Vue 3 composables.

- [ ] **`useStore(store)`** composable — `ref` wrapping `store.subscribe`; cleans up in `onUnmounted`
- [ ] **`useMachine(createFn, options)`** — creates machine on `onMounted`, destroys on `onUnmounted`
- [ ] Tier 1: SFC components (`.vue`) — `<script setup lang="ts">`, `defineProps`, `v-bind`
- [ ] Tier 2/3: composables + SFCs; prop-getters spread via `v-bind="getXProps()"`
- [ ] Spike the Angular adapter binding model during this phase (de-risk before Phase 4.2)

---

### 4.2 — `@web-loom/foolscap-angular`

- [ ] **`StoreService`** — injectable service wrapping `store.subscribe` + `OnDestroy`
- [ ] **`useMachine` directive/service pattern** — machine created in component `ngOnInit`, destroyed in `ngOnDestroy`
- [ ] Tier 1: standalone Angular components with `@Input()` for props; `HostBinding` for data attributes
- [ ] Tier 2/3: prop-getters applied via `@HostBinding` + template binding
- [ ] Zone.js compatibility: call `NgZone.run()` in subscribe callback to trigger change detection

---

## Phase 5 — Completeness & polish

**Outcome:** Full 60-component coverage, inverted mode, visual regression suite.

- [ ] Any Tier 2/3 components not completed in Phase 2 (check against spec list)
- [ ] **Inverted ("dark paper") mode** — `packages/tokens/src/palette-inverted.tokens.json`; swap `--paper`/`--ink` values; shipped as opt-in `:root[data-theme="dark"]` override in `tokens.css`
- [ ] **RTE decision** — ship minimal `contenteditable` tier or document a thin wrapper around ProseMirror/Tiptap; either way, spec the public API boundary
- [ ] **Visual regression suite** — Playwright screenshots of every component across: default, hover, focus, disabled, all variants; at mobile (375px) and desktop (1280px)
- [ ] **Token-only enforcement** — CI step: scan all `dist/components/*.css` for hard-coded values; fail if any found
- [ ] **Bundle size tracking** — add `bundlesize` or `size-limit` CI check; gates: `foolscap-core` < 20 kB gzipped, `foolscap-css` < 15 kB gzipped

---

## Phase 6 — 1.0

**Outcome:** Docs live, a11y sign-off, public semver guarantee.

- [ ] **Docs site** (`apps/docs/`) — framework: Astro or Next.js; live examples in React/Vue/Angular side by side; classless HTML version of every component; one-page mental model guide
- [ ] **Accessibility sign-off** — manual screen reader pass (NVDA + Firefox, VoiceOver + Safari) for every Tier 2/3 component; checklist gated as merge requirement
- [ ] **Automated a11y in CI** — axe-core scan on every component page in the docs; fail on any violation
- [ ] **Open Questions resolution** (from PRD §20):
  - RTE strategy (Q2) — must be decided before 1.0
  - Icon strategy (Q3) — decide: style-and-slot only vs. hairline icon set
  - Inverted mode at 1.0 or post-1.0 (Q4) — already done in Phase 5 if schedule allows
  - "Own the code" / shadcn-style eject path (Q5) — document decision
  - License + governance (Q6) — pick MIT or Apache 2.0; write CONTRIBUTING.md
- [ ] **Changesets + release workflow** — `packages/` versioned together; `CHANGELOG.md` generated
- [ ] **`@foolscap` scope migration note** — if scope becomes available, document upgrade path in docs

---

## Cross-cutting constraints (apply to every phase)

| Constraint | Rule |
|---|---|
| No hard-coded values | Every colour, size, space in CSS references a `--fc-*` token |
| No CSS-in-JS | All styles are in `.css` files; no runtime style injection |
| Class prefix | Always `fc-` |
| Token prefix | Always `--fc-` |
| State attribute | `data-state="open\|closed\|active\|disabled\|..."` |
| Custom events | Always `fc:[eventname]` with a typed `detail` payload |
| Motion | All transitions use `duration-fast` or `duration-base` tokens; wrap in `@media (prefers-reduced-motion: reduce) { transition: none }` |
| A11y gate | No Tier 2/3 component ships without keyboard table passing + axe scan clean |
| Bundle discipline | `@web-loom/foolscap-core` never imports persistence adapters from `@web-loom/store-core` |
| Spec source of truth | For any ambiguity, `.kiro/specs/[name]/spec.md` is the authority |

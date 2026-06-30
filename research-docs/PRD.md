# PRD — Foolscap: The World's Simplest Design System

| | |
|---|---|
| **Working title** | Foolscap *(placeholder — see Open Questions)* |
| **Document type** | Product Requirements Document |
| **Status** | Draft v0.2 |
| **Author** | Festus / The Baobab Solutions |
| **Date** | 27 June 2026 |
| **One-liner** | A paper-styled, black-and-white design system of 60 components plus layout primitives that works in any framework — shipping a portable styles layer and a portable behavior layer you can adopt as-is or adapt to anything. |

---

## 1. Summary

Foolscap is a design system built around a single editorial idea: **most UI complexity is accidental, not essential.** It ships the 60 components catalogued in [The Component Gallery](https://component.gallery/components/), plus a small set of layout primitives, in a form that is deliberately the simplest credible version of each.

The aesthetic is **paper**: off-white surfaces, near-black ink, hairline rules, and a single family of greys reserved for low-emphasis and loading states. No accent colours by default. The look is type-led and quiet, the kind of restraint that reads as "premium minimal" rather than "unfinished."

The architecture is **framework-agnostic by construction.** Styling lives in plain CSS driven by design tokens. Interactive behavior lives in a vanilla-TypeScript headless core (small state machines plus accessibility wiring). React, Vue, and Angular each get a thin adapter that binds that shared core to their idioms. Write the behavior once, style it once, consume it everywhere.

The marketing claim — *the world's simplest design system* — is treated in this document as a **measurable product constraint**, not a tagline. Every section below is held to it.

---

## 2. The thesis: what "simplest" means here

"Simplest" is easy to say and easy to betray. Foolscap commits to four operational definitions, each testable:

1. **Smallest defensible API.** Every component exposes the fewest props/attributes that still cover real use. If a prop only exists to undo a default, the default is wrong. Target: a developer can learn the entire system's API in an afternoon.
2. **Platform-first.** Where the browser already does the job (`<dialog>`, the Popover API, `<details>`, `<progress>`, native form inputs, CSS), Foolscap uses it and adds only the missing 10%. JavaScript is a last resort, not a starting point.
3. **One mental model across frameworks.** The same class names, the same tokens, the same behavior semantics in React, Vue, and Angular. Switching frameworks should not mean relearning the system.
4. **Zero-config to start, fully adaptable to finish.** A single classless stylesheet makes plain HTML look right with no build step. From there you can opt into classes, tokens, the headless core, and full restyling — without ever hitting a wall that forces a rewrite.

If a proposed feature makes any of these worse, it is the wrong feature.

---

## 3. Positioning & prior art

Foolscap is not novel in its parts; its contribution is the *combination* and the *restraint*. It learns explicitly from:

- **Headless behavior cores** (Zag.js, Ark UI, Radix Primitives, Ariakit, React Aria / React Spectrum, Base UI) — the idea that accessible interaction logic should be separable from styling and, ideally, from the framework.
- **Positioning** (Floating UI) for tooltips, popovers, menus, and selects.
- **Platform primitives** (Open UI, the native `dialog`/`popover`/`details` work) — lean on the standards track instead of reimplementing it.
- **Classless / minimal CSS** (Pico, Water.css, new.css, Sakura) — the "make raw HTML look good with no classes" pattern.
- **Token-driven theming** (the W3C Design Tokens format, Style Dictionary, Radix Colors' discipline) for a single source of visual truth.
- **The ownership model** (shadcn/ui) — the insight that teams want to *adapt* components, not be locked behind an opaque dependency.
- **Layout primitives** (Every Layout, Braid's layout components) — composition over bespoke CSS.

The differentiator: **none of the above gives you, in one package, a finished opinionated paper skin AND a portable headless core AND first-class React/Vue/Angular adapters AND a classless zero-build entry point.** Foolscap's wager is that the market gap is an *exhaustively simple, genuinely framework-neutral, visually finished* system.

---

## 4. Goals & non-goals

### Goals

- Deliver all 60 catalogue components plus layout primitives.
- Be usable from React, Vue, and Angular with parity, and from plain HTML via a classless stylesheet.
- Ship two separable layers — **styles** (tokens + CSS) and **behavior** (headless TS core) — that are useful independently.
- Be responsive across mobile, tablet, and desktop, primarily via container queries and fluid type.
- Meet WCAG 2.2 AA and the relevant ARIA Authoring Practices for every interactive component.
- Be adoptable incrementally and adaptable without forking.

### Non-goals

- **Not a colour system.** Default palette is black, white, and one grey ramp. Theming is *possible* via tokens but is not the product's purpose.
- **Not a kitchen sink of options.** Configurability is intentionally bounded.
- **No CSS-in-JS, no runtime style engine.** CSS ships as CSS.
- **Not a heavyweight rich-text platform.** The Rich text editor is a thin wrapper tier (see §7.3), not a Notion competitor.
- **Not a charting/data-viz library.** Out of scope.
- **No bespoke icon set** in v1 — Foolscap styles iconography and ships an `Icon` slot, but defers to existing open icon libraries.

---

## 5. Users & use cases

**Primary personas**

- *The solo builder / small team* who wants something that looks finished on day one without a designer, in whatever framework they already use.
- *The design-system maintainer* at a small org who wants a credible, accessible base to fork and rebrand rather than starting from zero.
- *The prototyper* who needs raw HTML to look right instantly (classless mode) before any framework is chosen.

**Representative use cases**

1. Drop the classless stylesheet into a static prototype → semantic HTML looks polished, no classes, no build.
2. `npm i @web-loom/foolscap-react` → build a responsive marketing site or admin panel with finished, accessible components.
3. Adopt only `@web-loom/foolscap-core` + own CSS → keep Foolscap's tested behavior and a11y, apply a bespoke brand skin.
4. Override a handful of tokens → shift the whole system from "paper" to a branded look without touching component code.

---

## 6. Design principles

1. **The page is paper; components are ink and rules.** Restraint is the brand.
2. **Defaults are decisions.** Every component looks right with no configuration.
3. **Semantics first.** Correct HTML before ARIA; ARIA before JavaScript; JavaScript before custom anything.
4. **One token, many surfaces.** Visual change happens in tokens, never in component internals.
5. **Behavior is portable.** Interaction logic is framework-agnostic and tested once.
6. **Accessible by default, not by opt-in.** Keyboard, focus, and screen-reader support are part of "done."
7. **Composable layout over bespoke layout.** Spacing and structure come from primitives, not one-off CSS.

---

## 7. Component scope

### 7.1 Strategy: tier by how much the platform already gives us

The simplicity dividend comes from refusing to write JavaScript the browser has made unnecessary. Components are sorted into three tiers.

**Tier 1 — Presentational (CSS only, no behavior package needed).** Styled by the stylesheet; usable in classless mode.

> Avatar · Badge · Breadcrumbs · Button · Button group · Card · Empty state · Fieldset · File · Footer · Header · Heading · Hero · Icon · Image · Label · Link · List · Quote · Separator · Skeleton · Skip link · Spinner · Stack · Table · Visually hidden · Progress bar *(native `<progress>`)* · Checkbox / Radio button / Text input / Textarea / Search input / Date input / Color picker / Slider *(native form controls, styled)*

**Tier 2 — Platform-enhanced (native element + a thin behavior shim).** Mostly CSS, small JS only for gaps (focus management, fallback positioning, progressive enhancement).

> Accordion *(`<details>`/`<summary>`)* · Modal *(native `<dialog>`)* · Popover *(Popover API)* · Toggle *(styled checkbox + keyboard semantics)* · Form *(validation/state helpers)* · Footer/Header navigation affordances

**Tier 3 — Behavior-driven (headless state machine required).** Real interaction logic lives in `@web-loom/foolscap-core` and is wrapped per framework.

> Carousel · Combobox · Datepicker · Drawer · Dropdown menu · Navigation *(menus/disclosure)* · Pagination · Progress indicator (Stepper/Steps) · Rating · Segmented control · Select *(custom)* · Tabs · Toast · Tooltip · Tree view · Stepper (numeric) · Slider *(when custom thumb behavior is needed)*

**Special case — Rich text editor.** Genuinely not "simple." v1 ships a *minimal* contenteditable-based editor covering bold/italic/lists/links/headings only, or a documented thin wrapper around a proven engine. Anything richer is explicitly out of scope and signposted as such.

A complete inventory with tier and strategy is in the [Appendix](#appendix-full-component-inventory).

### 7.2 Layout components (the additions beyond the 60)

Layout is where "simple" systems usually leak bespoke CSS. Foolscap ships a small, composable set (informed by Every Layout / Braid). Proposed v1 set:

> **Box** · **Stack** *(already in the 60; the vertical-rhythm primitive)* · **Inline / Cluster** · **Grid** · **Columns** · **Sidebar** · **Switcher** · **Center** · **Cover** · **Container** · **AspectRatio / Frame** · **Spacer**

Each maps to modern CSS (flex, grid, container queries) and is driven by spacing tokens. No magic numbers.

### 7.3 Component contract (consistency across all 60)

Every component, regardless of tier, honours the same contract:

- A documented set of **parts** (e.g. `root`, `trigger`, `panel`) with stable class names and data-attributes for state (`data-state="open"`).
- **Tokenised** styling only — no hard-coded colours, spacing, or type sizes in component CSS.
- A **headless equivalent** (where behavior exists) exposing state and prop-getters, framework-independent.
- **A11y baked in** — roles, keyboard map, and focus behavior per the ARIA APG.
- **Identical semantics** across React/Vue/Angular adapters.

---

## 8. Visual language — "paper"

### 8.1 Palette

Defaults only. All overridable via tokens.

| Token | Default | Use |
|---|---|---|
| `--paper` | `#FBFBF9` (warm off-white) | Page / surface background |
| `--ink` | `#1A1A1A` (soft black) | Primary text, borders, icons |
| `--ink-muted` | `#5C5C5C` | Secondary text |
| `--grey-100…900` | neutral ramp | Borders, disabled, **loading/skeleton states** |
| `--paper-raised` | `#FFFFFF` | Cards / overlays (one step "above" the page) |

No accent hue in the default theme. Emphasis is created with weight, rule, and space — not colour.

### 8.2 Surfaces, depth & texture

- **Hairline rules** (1px `--ink` at low opacity) instead of heavy borders.
- **Paper-cut elevation**: at most one subtle, tight shadow to lift overlays; stacking is communicated by thin borders and offset, not drop shadows.
- **Optional paper grain**: a very low-contrast noise texture available as an opt-in token, off by default.
- **Flat by default** — the system should look good even with `box-shadow: none`.

### 8.3 Typography

- Type-led system. A fluid modular scale via `clamp()`.
- One serif + one sans recommendation shipped as token defaults (swappable). Monospace for code/data.
- Generous line length and vertical rhythm enforced by the `Stack` primitive.

### 8.4 Motion

- Minimal, functional, fast (120–200ms). Respects `prefers-reduced-motion`.
- Loading is the main animated state: greyscale skeleton shimmer and the `Spinner`.

### 8.5 Inverted mode (optional)

Because the palette is token-driven, an **ink-inverted "dark paper"** mode (near-black surface, paper-white ink) is nearly free. Shipped as an opt-in token set, not a separate codebase. Still black-and-white — just reversed.

---

## 9. Architecture

The system is four layers. Each is independently consumable, and each lower layer has no dependency on the one above it.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Framework adapters  [ npm scope: @web-loom ]                          │
│  foolscap-react  ·  foolscap-vue  ·  foolscap-angular                  │
│  (thin bindings: bind core state → framework idioms)                   │
├────────────────────────────────────────────────────────────────────────┤
│  @web-loom/foolscap-core  — headless behavior                          │
│  vanilla-TS state machines + a11y wiring + prop-getters                │
│  depends on @web-loom/store-core  (reactive atom — ADR-001)            │
│  (Tier 2 shims and Tier 3 machines; framework-free)                    │
├────────────────────────────────────────────────────────────────────────┤
│  @web-loom/foolscap-css  — the paper skin                              │
│  classless layer + class-based layer + parts/data-state CSS            │
│  (usable with plain HTML, no JS, no framework)                         │
├────────────────────────────────────────────────────────────────────────┤
│  @web-loom/foolscap-tokens  — design tokens                            │
│  W3C token format → CSS custom properties (source of truth)            │
└────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Tokens (`@web-loom/foolscap-tokens`)

Authoritative design decisions in the W3C Design Tokens JSON format, compiled to CSS custom properties (and optionally JS/TS exports). This is the single point of visual change. Brand a whole system by overriding tokens; never by editing component CSS.

### 9.2 Styles (`@web-loom/foolscap-css`)

Pure CSS, framework-free, no preprocessor required (PostCSS only for nesting/autoprefix at build). Two surfaces:

- **Classless layer** — styles semantic elements directly so raw HTML looks right (the zero-config entry point).
- **Class + parts layer** — explicit classes and `data-state` selectors for the styled components.

Distributed as a CDN-droppable stylesheet *and* as importable, tree-shakeable per-component CSS.

### 9.3 Behavior (`@web-loom/foolscap-core`)

The heart of framework-neutrality. Each interactive component is a small **state machine** plus **prop-getters** (functions returning the attributes/handlers a host element needs) and **a11y logic** — the Zag.js / React Aria pattern. Floating UI handles positioning. The core knows nothing about React, Vue, or Angular; it manipulates state and describes what the DOM should be.

**Reactive primitive: `@web-loom/store-core`.** The `create*` functions in `@web-loom/foolscap-core` use `@web-loom/store-core` as their reactive atom — each component instance owns its own store. The `subscribe(newState, oldState)` callback is the seam framework adapters hook into; `destroy()` maps to component teardown. See §21 for the full decision record.

Benefits: behavior and accessibility are written and **tested once**, then reused everywhere. A bug fix in focus-trapping fixes all three frameworks simultaneously.

### 9.4 Adapters (`@web-loom/foolscap-{react,vue,angular}`)

Each adapter is intentionally thin: it subscribes to a core machine, maps prop-getters onto the framework's element binding, and exposes idiomatic components/composables/directives. Adapters add no behavior of their own — that would break parity.

### 9.5 Consumption modes (the "adapt for all use cases" requirement)

| Mode | You get | You give up | Who it's for |
|---|---|---|---|
| **Classless** | `<link>` one stylesheet | Custom classes | Prototypes, static sites |
| **Styled components** | Finished components, your framework | Some styling control | Most teams |
| **Headless + tokens** | Behavior core + retheme via tokens | The default skin | Branded systems |
| **Headless + own CSS** | Behavior/a11y only | All default styling | Bespoke design systems |
| **Own the code** *(stretch)* | Copy component source in | Update-via-package | Heavy customisers |

---

## 10. Responsive strategy

- **Container queries first.** Components respond to *their container*, not the viewport — the correct model for a design system used in unpredictable layouts (sidebars, modals, grids).
- **Fluid type and space** via `clamp()` so the system scales smoothly across mobile → tablet → desktop without a cascade of breakpoints.
- **Touch-first ergonomics**: interactive targets ≥ 44×44px; pointer-type-aware affordances.
- **Layout primitives** carry the responsive load (`Switcher`, `Sidebar`, `Columns`, `Grid`) so app code rarely writes media queries.
- A small, documented set of named breakpoints exists as tokens for the cases container queries can't cover.

---

## 11. Accessibility

Accessibility is a release gate, not a nice-to-have.

- **WCAG 2.2 AA** target across the system; documented per component.
- **ARIA Authoring Practices** patterns for every Tier 2/3 component (roles, keyboard interaction, focus order).
- Focus management (traps, restoration, roving tabindex) lives in `@web-loom/foolscap-core`, so it is correct in every framework by construction.
- Honours `prefers-reduced-motion` and `prefers-contrast`.
- The black-on-paper defaults are chosen to clear AA contrast comfortably.
- **UDL alignment**: where a component conveys state by colour/shape, it also conveys it textually or by icon (dual coding) — multiple means of representation by default.
- Automated a11y checks (axe) in CI plus a manual screen-reader pass per component before it ships.

---

## 12. Theming & adaptation

- **Primary lever: tokens.** Override CSS custom properties (globally or scoped to a subtree) to rebrand. No build step required.
- **Secondary lever: parts + data-state selectors.** Stable, documented hooks let teams restyle specific parts without fighting specificity.
- **Deep lever: headless core.** Take behavior, bring your own markup and CSS.
- Theming never requires editing distributed component internals. If it does, the component's API is wrong.

---

## 13. Distribution & packaging

Monorepo (Turborepo), ESM-first, fully tree-shakeable, published to npm.

```
foolscap/
├── packages/
│   ├── tokens/        @web-loom/foolscap-tokens    (W3C tokens → CSS vars)
│   ├── css/           @web-loom/foolscap-css       (classless + class layers)
│   ├── core/          @web-loom/foolscap-core      (headless TS behavior)
│   │                  └─ depends on @web-loom/store-core
│   ├── react/         @web-loom/foolscap-react
│   ├── vue/           @web-loom/foolscap-vue
│   └── angular/       @web-loom/foolscap-angular
├── apps/
│   ├── docs/          (documentation site + live examples)
│   └── playground/    (Vite dev harness for all frameworks)
└── tooling/           (shared config: ts, vite, vitest, eslint)
```

- **CDN**: a single `foolscap.css` for the classless/zero-build path.
- **Per-package**: import only what you use; CSS is per-component splittable.
- **Versioning**: changesets-driven; core and adapters versioned together to guarantee parity.

---

## 14. Tech stack & tooling

| Concern | Choice | Notes |
|---|---|---|
| Language | **TypeScript** (strict) | Core, adapters, tokens all typed end-to-end |
| Styling | **CSS** (custom properties; PostCSS for nesting/autoprefix) | No CSS-in-JS, no runtime |
| Build / dev | **Vite** | Library mode per package; playground dev server |
| Test | **Vitest** | Unit + Vitest **browser mode** for behavior/DOM tests |
| Monorepo | Turborepo + pnpm workspaces | `@web-loom` npm scope; matches existing Baobab tooling |
| Reactive atom | **`@web-loom/store-core`** | Per-instance store backing `@web-loom/foolscap-core` machines; zero deps, framework-agnostic (see §21) |
| Positioning | Floating UI | Tooltips, popovers, menus, selects |
| Release | Changesets | Coordinated, parity-preserving releases |
| CI | GitHub Actions | Lint, typecheck, unit, a11y (axe), visual regression |

Deliberately no Sass/Less, no Tailwind dependency, no component runtime beyond the small core. The stack is the simplest that satisfies the layers in §9.

---

## 15. Testing strategy

- **Behavior (core):** Vitest browser mode drives each state machine through its interaction contract (open/close, keyboard maps, focus). Because behavior is shared, these tests cover all three frameworks at the source.
- **Adapters:** thin smoke tests confirming each adapter wires core state to the framework correctly.
- **Accessibility:** automated axe runs in CI; documented manual screen-reader checklist per component as a merge gate.
- **Visual regression:** snapshot the paper skin across the responsive range (mobile/tablet/desktop) and both palette modes.
- **Token integrity:** assert components reference tokens only — no hard-coded visual values (lint rule).

---

## 16. Developer experience

- **Docs site** with live, editable examples in all three frameworks side-by-side, plus the classless HTML version of each component.
- **One concepts page** that teaches the whole mental model (tokens → CSS → core → adapters) — readable in one sitting, supporting the "learn it in an afternoon" goal.
- **Copy-paste** snippets for every component, every framework.
- **Accessibility notes** and the keyboard map shown inline on each component page.
- A **Vite playground** for contributors to develop components against all adapters at once.

---

## 17. Success metrics

The marketing claim is held accountable by numbers:

- **Coverage:** all 60 components + the layout set shipped.
- **Platform leverage:** ≥ 60% of the 60 usable with **zero JavaScript** (Tier 1 + classless).
- **Core size:** `@web-loom/foolscap-core` ships small (target: well under a typical headless library's footprint; tracked per release).
- **Parity:** 100% behavioral parity across React/Vue/Angular, enforced by shared core tests.
- **Onboarding:** a new developer renders a styled, accessible page in **under 5 minutes** (classless or one install).
- **Learnability:** the full public API documented on pages a developer can read in **one afternoon**.
- **A11y:** every interactive component passes automated axe checks and its manual APG checklist.

---

## 18. Roadmap

| Phase | Scope | Outcome |
|---|---|---|
| **0 — Foundations** | Monorepo, tooling, `@web-loom/foolscap-tokens`, paper palette, type scale, motion | Token pipeline + visual language locked |
| **1 — Classless skin** | `@web-loom/foolscap-css` classless layer covering Tier 1 + native form controls | Raw HTML looks finished; CDN stylesheet ships |
| **2 — Core + first behaviors** | `@web-loom/foolscap-core` machines for the highest-value Tier 3 (Tabs, Modal, Tooltip, Popover, Combobox, Select, Toast) | Headless core proven on hard components |
| **3 — React adapter** | `@web-loom/foolscap-react` over the full component set + layout primitives | First end-to-end framework, docs live |
| **4 — Vue + Angular adapters** | Parity adapters from the same core | Three-framework parity achieved |
| **5 — Completeness & polish** | Remaining Tier 2/3 components, RTE minimal tier, inverted mode, visual-regression suite | Full 60 + layout, 1.0 candidate |
| **6 — 1.0** | Docs, accessibility sign-off, semver guarantees | Public 1.0 |

*(Sequencing, not dates — phases are dependency-ordered.)*

---

## 19. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Scope creep destroys "simplest."** | Treat the four definitions in §2 as gates; reject features that worsen any. Non-goals are load-bearing. |
| **Three-framework parity is expensive.** | Behavior centralised in `@web-loom/foolscap-core`; adapters kept deliberately thin so the cost is mostly one-time and shared. |
| **Native primitive support gaps** (e.g. Popover API, `<dialog>` styling) across browsers. | Progressive enhancement with documented fallbacks in the core shims; test matrix covers baseline browsers. |
| **Rich text editor pulls the project toward complexity.** | Hard-scope to the minimal tier; never let it set the bar for "simple." |
| **"Paper / black-and-white" reads as unfinished to some buyers.** | Lean into editorial polish (type, rhythm, hairlines); ship the inverted mode and the token story so it's clearly a *choice*, not a limitation. |
| **Angular's idioms diverge most** from a getter-based core. | Spike the Angular adapter early (Phase 4 design started in Phase 2) to de-risk the binding model. |

---

## 20. Open questions / decisions needed

1. ~~**Name.**~~ **Resolved — see ADR-002.** Product name: **Foolscap**. npm scope: **`@web-loom`**. Packages: `@web-loom/foolscap-{tokens,css,core,react,vue,angular}`. Class prefix: `fc-`. Token prefix: `--fc-`.
2. **RTE depth.** Ship a tiny contenteditable editor, or a documented thin wrapper around an external engine? Affects scope and dependency posture.
3. **Icon strategy.** Style-and-slot only (defer to existing libs) vs. ship a minimal hairline icon set to match the paper aesthetic.
4. **Inverted mode at 1.0 or post-1.0?** Cheap technically, but adds a testing surface.
5. **"Own the code" path.** Is a shadcn-style eject path in scope for 1.0, or a later add-on?
6. **License & governance.** Open-source license choice and contribution model (relevant given the open-source tooling-gap thesis).

---

## Appendix: full component inventory

Tier 1 = CSS-only / native, no behavior package. Tier 2 = native element + thin shim. Tier 3 = headless behavior machine.

| Component | Tier | Strategy |
|---|---|---|
| Accordion | 2 | `<details>`/`<summary>`, styled; optional single-open coordination in core |
| Alert | 1 | Presentational; `role="alert"` where live |
| Avatar | 1 | CSS (image/initials fallback) |
| Badge | 1 | CSS |
| Breadcrumbs | 1 | CSS + semantic nav/list |
| Button | 1 | Native `<button>`, styled |
| Button group | 1 | CSS wrapper |
| Card | 1 | CSS surface (`--paper-raised`) |
| Carousel | 3 | Core machine (scroll-snap + controls, a11y) |
| Checkbox | 1 | Native input, styled |
| Color picker | 1 | Native `input[type=color]`, styled |
| Combobox | 3 | Core machine (filter, list nav, APG combobox) |
| Date input | 1 | Native segmented inputs, styled |
| Datepicker | 3 | Core machine (calendar grid, keyboard) |
| Drawer | 3 | Core (focus trap, dismiss, edge slide) |
| Dropdown menu | 3 | Core (menu APG + Floating UI) |
| Empty state | 1 | CSS composition |
| Fieldset | 1 | Native `<fieldset>`/`<legend>`, styled |
| File | 1 | CSS representation |
| File upload | 2/3 | Native input + drag/drop shim |
| Footer | 1 | CSS layout |
| Form | 2 | Styled + validation/state helpers in core |
| Header | 1 | CSS layout |
| Heading | 1 | CSS type scale |
| Hero | 1 | CSS layout primitive composition |
| Icon | 1 | Styled slot (defers to icon lib) |
| Image | 1 | CSS (+ AspectRatio primitive) |
| Label | 1 | Native `<label>`, styled |
| Link | 1 | Native `<a>`, styled |
| List | 1 | Native lists, styled |
| Modal | 2 | Native `<dialog>` + focus-management shim |
| Navigation | 3 | Core (disclosure/menu patterns) |
| Pagination | 3 | Core (state) + semantic nav |
| Popover | 2 | Popover API + Floating UI fallback |
| Progress bar | 1 | Native `<progress>`, styled |
| Progress indicator (Stepper/Steps) | 3 | Core (step state) |
| Quote | 1 | CSS (blockquote/pull-quote) |
| Radio button | 1 | Native input, styled |
| Rating | 3 | Core (radio-group semantics + keyboard) |
| Rich text editor | 3* | Minimal tier (contenteditable) or thin wrapper |
| Search input | 1 | Native `input[type=search]`, styled |
| Segmented control | 3 | Core (radio/tabs hybrid, keyboard) |
| Select | 3 | Core custom listbox (APG) + native fallback |
| Separator | 1 | CSS / `<hr>` |
| Skeleton | 1 | CSS (grey shimmer) |
| Skip link | 1 | CSS + focus styling |
| Slider | 1/3 | Native range styled; core when custom thumb needed |
| Spinner | 1 | CSS animation |
| Stack | 1 | Layout primitive |
| Stepper (numeric) | 3 | Core (increment/decrement, bounds) |
| Table | 1 | Native table, styled |
| Tabs | 3 | Core (APG tabs, roving tabindex) |
| Text input | 1 | Native input, styled |
| Textarea | 1 | Native textarea, styled |
| Toast | 3 | Core (queue, timers, live region) |
| Toggle | 2 | Styled checkbox + switch semantics |
| Tooltip | 3 | Core (hover/focus intent + Floating UI) |
| Tree view | 3 | Core (APG tree, keyboard) |
| Video | 1/2 | Native `<video>`, styled controls slot |
| Visually hidden | 1 | CSS utility |

**Plus layout primitives:** Box · Stack · Inline/Cluster · Grid · Columns · Sidebar · Switcher · Center · Cover · Container · AspectRatio/Frame · Spacer.

---

*Source for the component set: [The Component Gallery](https://component.gallery/components/).*

---

## 21. Architecture Decision Log

Decisions that are resolved, non-obvious, or that close off alternatives worth remembering.

---

### ADR-001 — Reactive primitive for `@web-loom/foolscap-core`: `@web-loom/store-core`

| | |
|---|---|
| **Date** | 27 June 2026 |
| **Status** | Decided |
| **Decider** | Festus / The Baobab Solutions |

**Context**

`@web-loom/foolscap-core` must manage per-instance component state (open/closed, selected value, active index, focus position, etc.) in a way that is framework-agnostic and that framework adapters can subscribe to efficiently. The choices were:

- A formal state-machine library (Zag.js, XState)
- A lightweight reactive store
- Bespoke plain-object + listener pattern

**Decision**

Use **`@web-loom/store-core`** (the author's own library, MIT, zero dependencies) as the reactive atom underneath each `create*` machine in `@web-loom/foolscap-core`.

Each component instance calls `createStore(initialState, createActions)` internally and wraps it to expose the Foolscap prop-getter API:

```ts
// conceptual sketch — packages/core/src/tabs.ts
import { createStore } from '@web-loom/store-core'

export function createTabs(options = {}) {
  const store = createStore(
    { value: options.defaultValue ?? '' },
    (set, get) => ({
      select: (value: string) => {
        if (get().value === value) return          // manual guard
        set(s => ({ ...s, value }))
        options.onValueChange?.(value)
      }
    })
  )

  return {
    getTablistProps: () => ({ role: 'tablist' }),
    getTabProps: (value: string) => ({
      role: 'tab',
      'aria-selected': store.getState().value === value,
      tabIndex: store.getState().value === value ? 0 : -1,
      onClick: () => store.actions.select(value),
    }),
    getPanelProps: (value: string) => ({
      role: 'tabpanel',
      hidden: store.getState().value !== value,
    }),
    get state() { return store.getState() },
    subscribe: store.subscribe.bind(store),
    destroy: store.destroy.bind(store),
  }
}
```

Framework adapters use `subscribe(newState, oldState)` to trigger re-renders; `destroy()` maps to component teardown / `onUnmounted` / `ngOnDestroy`.

**Reasons for this choice**

| Factor | Detail |
|--------|--------|
| **Zero deps** | `@web-loom/store-core` has no runtime dependencies — `@web-loom/foolscap-core`'s bundle stays lean |
| **Framework-agnostic** | Pure TypeScript; no DOM or framework API used in the reactive layer |
| **First-party control** | Same author owns the library; the API can evolve in lockstep with Foolscap's needs without waiting on upstream |
| **Clean adapter seam** | `subscribe(new, old)` is the exact shape all three framework adapters need; `destroy()` maps directly to component lifecycle hooks |
| **Per-instance isolation** | `createStore` returns an instance, not a global — each Tooltip, each Tabs, each Combobox is fully isolated |
| **Simple mental model** | The store is a thin reactive atom; all component-specific logic (keyboard handling, ARIA, prop-getters, guards, events) lives explicitly in `@web-loom/foolscap-core` — contributors read one file, not a state-chart DSL |

**Alternatives considered**

| Alternative | Why rejected |
|-------------|-------------|
| **Zag.js** | Powerful and purpose-built for headless UI, but adds an external dependency, requires learning the actor/state-chart model, and exceeds what Foolscap's machines need |
| **XState v5** | Well-proven but heavyweight for per-component instances; steep learning curve for contributors; overkill for the scale of machines Foolscap needs |
| **Bespoke listeners** | Simpler initially, but would require writing subscription bookkeeping, equality checks, and `destroy` cleanup repeatedly; `@web-loom/store-core` provides exactly that for free |

**Known trade-offs / constraints**

- **No built-in transition guards.** `@web-loom/store-core` is an unguarded store — any action can call `set()` at any time. Guards (e.g., "only open if not already open") must be written as explicit `if` checks inside actions. This is disciplined but not enforced structurally.
- **No hierarchical states.** Components like TreeView and Navigation with parent-child state must represent that as flat data structures managed by convention.
- **No selector memoization.** Prop-getters are computed on demand from `getState()` — not memoized. This is acceptable because prop-getters are called by framework adapters on each render cycle, which is the correct moment to recompute. If render-thrash becomes an issue, a memoization helper can be added to the adapter layer.
- **Persistence adapters ship in the package.** `LocalStorageAdapter`, `IndexedDBAdapter`, and `MemoryAdapter` are exported alongside `createStore`. Confirm tree-shaking eliminates them from the `@web-loom/foolscap-core` bundle (they are never imported by core machines). Track bundle size per release per §17. Note: a subpath-export refactor of `@web-loom/store-core` (`/persist` entry) was completed to make this guarantee structural rather than reliant on bundler behaviour.

---

### ADR-002 — Product name and npm package scope

| | |
|---|---|
| **Date** | 28 June 2026 |
| **Status** | Decided |
| **Decider** | Festus / The Baobab Solutions |

**Context**

The product needed a stable name before Phase 0 could begin, because the name determines:
- npm package scopes (baked into every `package.json` and every `import` statement)
- CSS class prefix (`fc-`, used across all 72 component specs)
- CSS token prefix (`--fc-`)
- The public brand / marketing identity

The working title was `Foolscap` — a real paper format (approx. A4), fitting the paper aesthetic, and with a memorable cheeky quality common in tech tooling. The natural abbreviation `fc` aligned perfectly with the class prefix already established across all specs.

The `@foolscap` npm org scope was found to be unavailable.

**Decision**

- **Product name:** Foolscap (confirmed — not a placeholder)
- **npm scope:** `@web-loom` (already owned; same org as `@web-loom/store-core`)
- **Package names:** `@web-loom/foolscap-{tokens,css,core,react,vue,angular}`
- **CSS class prefix:** `fc-` (justified by the product name, independent of the npm scope)
- **CSS token prefix:** `--fc-`

**Reasons**

| Factor | Detail |
|--------|--------|
| **Name quality** | `fc-` is already in all 72 component specs; alternatives (Ream → `rm-`, Quire → `qr-`) produce worse or conflicting abbreviations |
| **Cheeky names age well** | Common pattern in successful tooling (Bun, Vite, Zag, Remix); the "fool" reading is a feature, not a liability |
| **Paper etymology** | A foolscap is a genuine paper format — the aesthetic is literal, not metaphorical |
| **`@web-loom` scope** | Already registered and owned; no new npm org needed; tells a coherent story: web-loom is the infrastructure layer, Foolscap is the product built on it |
| **`@web-loom/store-core` as a dep** | Reinforces the ecosystem narrative — `store-core` feeds `foolscap-core`; two products, one org |

**Alternatives considered**

| Alternative | Why rejected |
|-------------|-------------|
| **`@foolscap/*` scope** | Unavailable on npm |
| **Ream** | `rm-` prefix conflicts with Unix `rm`; less distinctive |
| **Quire** | `qr-` reads as QR code; obscure paper term |
| **Bond** | Generic; no natural `fc-` abbreviation |
| **Own scope + rename** | Would invalidate all 72 specs already written with `fc-` prefix |

**Known trade-offs**

- `@web-loom/foolscap-react` is longer than `@foolscap/react`. Accepted: clarity and correctness over brevity at this stage.
- If `@foolscap` becomes available later, a package rename in a major version is a straightforward migration (find-and-replace in imports + npm deprecation notice on old names).
- The product is marketed and documented as **Foolscap**, not as **web-loom/foolscap** — the npm scope is an implementation detail, not the brand.
# [Component Name]

> [One-line description from components.md]  
> **Tier:** [1 — CSS only | 2 — Platform + shim | 3 — Headless machine]  
> **Also known as:** [aliases, or —]  
> **Native element:** [`<details>` | `<dialog>` | `<input type="...">` | —]

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-[name]` | Outermost wrapper |
| `[part]` | `<[el]>` | `.fc-[name]__[part]` | … |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| [state] | `data-state` | `[value]` | `[part]` |

> **Tier 1 note:** Omit this table if the only states are CSS pseudo-classes (`:hover`, `:focus`, `:disabled`). Include only when a custom `data-*` attribute is needed.

---

## Design Tokens

Component-specific tokens only. Global tokens (`--paper`, `--ink`, `--ink-muted`, `--grey-*`) are inherited from the sheet without listing.

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-[name]-[property]` | `[css-prop]` | `[value or var(--global)]` |

---

## HTML — Classless

Zero classes. The `@foolscap/css` classless layer styles semantic elements directly. Copy-paste ready.

```html
<!-- minimal semantic markup, no classes needed -->
```

---

## HTML — Class-based

Full anatomy with explicit `fc-` classes and `data-*` state attributes.

```html
<!-- same structure with .fc- classes, data-state, data-variant etc. -->
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [APG pattern name + URL, or "No specific APG pattern"] |
| **Role(s)** | [roles on relevant parts, or "Inherited from native element"] |
| **Required attributes** | [aria-* that must be present, or "None beyond semantic HTML"] |
| **Contrast** | Meets WCAG 2.2 AA (ink `#1A1A1A` on paper `#FBFBF9` defaults) |

**Keyboard interaction** *(Tier 2 / 3 only — omit for Tier 1)*

| Key | Action |
|-----|--------|
| `[key]` | [what it does] |

---

## Behavior

> **Tier 1:** Omit this section — no JavaScript needed.  
> **Tier 2:** Include "Native element" + short "Shim responsibilities" list + minimal core API sketch.  
> **Tier 3:** Full contract required — native element, all machine responsibilities, core API, custom events.

**Native element / API used:** `<details>` / Popover API / `<dialog>` / —

**Shim / machine responsibilities:**
- [bullet: what JS must handle that the native element cannot]

**`@foolscap/core` API sketch:**

```ts
create[ComponentName](options?: {
  // minimal, documented options
}): {
  // returned prop-getters and reactive state
  get[Part]Props(): Record<string, unknown>
  state: { /* ... */ }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:[event]` | `{ … }` | [trigger condition] |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `[values]` | [visual change] |
| `data-size` | `sm \| md \| lg` | [size change] |

> Omit this section if the component has no meaningful variants beyond default.

---

## Notes

- [Constraints, open questions, or future expansion hooks — keep it brief]

---

<!-- 
SPEC WRITING GUIDE (remove this block in real specs)

Tier rules:
  Tier 1 — CSS only:
    - Omit "Behavior" section entirely
    - Omit keyboard interaction table
    - Omit States table if only CSS pseudo-classes apply
    - Anatomy can be a single-row table for single-element components

  Tier 2 — Platform + thin shim:
    - Include Behavior with "Native element" + short shim list
    - Core API sketch is minimal (1–3 prop-getters max)
    - States table required

  Tier 3 — Headless machine:
    - Full Behavior section required
    - Core API sketch required (all prop-getters + state shape + options)
    - Keyboard interaction table required
    - Custom events table required
    - States table required

Global conventions:
  Class prefix:     fc-
  BEM:              fc-[component]__[part]
  Token prefix:     --fc-
  State attr:       data-state="open|closed|active|disabled|..."
  Variant attr:     data-variant="primary|secondary|ghost|..."
  Size attr:        data-size="sm|md|lg"
  Custom events:    fc:[eventname]
-->

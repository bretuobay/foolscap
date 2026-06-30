# Accordion

> A vertical stack of interactive headings used to toggle the display of further information.
> **Tier:** 2 — Platform + shim
> **Also known as:** Arrow toggle, Collapse, Collapsible sections, Details, Disclosure, Expandable
> **Native element:** `<details>` / `<summary>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-accordion` | Wrapper; carries `data-type` |
| `item` | `<details>` | `.fc-accordion__item` | One collapsible unit; carries `data-state` |
| `trigger` | `<summary>` | `.fc-accordion__trigger` | Clickable heading inside `<details>` |
| `panel` | `<div>` | `.fc-accordion__panel` | Content wrapper inside `<details>` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Open / closed | `data-state` | `open` · `closed` | `item` |
| Mode | `data-type` | `single` · `multiple` | `root` |

> `data-state` mirrors the native `open` attribute on `<details>` and is kept in sync by the shim for CSS targeting.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-accordion-item-border` | `border-bottom` on item | `1px solid var(--ink)` at 15% opacity |
| `--fc-accordion-trigger-padding` | `padding` on trigger | `0.75rem 0` |
| `--fc-accordion-panel-padding` | `padding` on panel | `0 0 0.75rem` |
| `--fc-accordion-gap` | `gap` between items | `0` |
| `--fc-accordion-icon-size` | width/height of chevron icon | `1rem` |

---

## HTML — Classless

```html
<details>
  <summary>What is Foolscap?</summary>
  <p>A paper-styled, framework-agnostic design system.</p>
</details>

<details>
  <summary>How do I install it?</summary>
  <p>Drop in the classless stylesheet or install via npm.</p>
</details>
```

---

## HTML — Class-based

```html
<div class="fc-accordion" data-type="single">
  <details class="fc-accordion__item" data-state="open">
    <summary class="fc-accordion__trigger">What is Foolscap?</summary>
    <div class="fc-accordion__panel">
      <p>A paper-styled, framework-agnostic design system.</p>
    </div>
  </details>

  <details class="fc-accordion__item" data-state="closed">
    <summary class="fc-accordion__trigger">How do I install it?</summary>
    <div class="fc-accordion__panel">
      <p>Drop in the classless stylesheet or install via npm.</p>
    </div>
  </details>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [APG Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) — native `<details>` satisfies this without explicit ARIA |
| **Role(s)** | `button` (implicit on `<summary>`); `group` (implicit on `<details>`) |
| **Required attributes** | None beyond semantic HTML — `<details>`/`<summary>` carry all required semantics natively |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Toggle item open / closed (native `<summary>` behavior) |
| `Tab` | Move focus to next focusable element |
| `Shift + Tab` | Move focus to previous focusable element |

---

## Behavior

**Native element / API used:** `<details>` / `<summary>` — the browser toggles open/closed natively on `<summary>` click or keyboard activation.

**Shim responsibilities:**
- **Single-open mode:** When `data-type="single"` on root, listen for the native `toggle` event on each `<details>`. When one opens, programmatically remove the `open` attribute from all siblings.
- **State sync:** On each `toggle` event, update `data-state` on the `<details>` to `"open"` or `"closed"` so CSS can target it.
- **Custom event:** Dispatch `fc:toggle` on the `item` element after each state change.
- **Animation (progressive enhancement):** Apply `grid-template-rows: 0fr → 1fr` transition on the panel via CSS; the shim adds a `.fc-accordion--animated` class to root when `prefers-reduced-motion` is not set.

**`@foolscap/core` API sketch:**

```ts
createAccordion(options?: {
  type?: 'single' | 'multiple'   // default: 'multiple'
  defaultOpenItems?: string[]    // item ids open on init
}): {
  getItemProps(id: string): Record<string, unknown>
  getTriggerProps(id: string): Record<string, unknown>
  getPanelProps(id: string): Record<string, unknown>
  state: { openItems: string[] }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:toggle` | `{ itemId: string, open: boolean }` | After an item opens or closes |

---

## Notes

- The `<panel>` wrapper div is needed for CSS animation (animating `height` on `<details>` directly is unreliable); content is slotted inside it.
- In classless mode, no `<div class="fc-accordion__panel">` is needed — the shim is also absent, so single-open mode is unavailable without adding classes.
- Future expansion: `data-disabled` on individual items; keyboard navigation between triggers (arrow keys, per APG Accordion pattern).

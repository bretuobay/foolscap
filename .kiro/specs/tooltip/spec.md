# Tooltip

> Displays a description or extra information about an element, usually on hover.
> **Tier:** 3 — Headless machine
> **Also known as:** Toggletip
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<span>` or `<div>` | `.fc-tooltip` | Wrapper; passes props to trigger child |
| `trigger` | (host element) | — | The element being described; receives `aria-describedby` |
| `content` | `<div>` | `.fc-tooltip__content` | The tooltip bubble; `role="tooltip"` |
| `arrow` | `<div>` | `.fc-tooltip__arrow` | Optional visual pointer (Floating UI managed) |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Visibility | `data-state` | `"open"` · `"closed"` | `root` |
| Described | `aria-describedby` | tooltip `id` | `trigger` element |
| Tooltip role | `role` | `"tooltip"` | `content` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-tooltip-bg` | `background` on content | `var(--ink)` |
| `--fc-tooltip-color` | `color` on content | `var(--paper)` |
| `--fc-tooltip-padding` | `padding` on content | `0.25rem 0.5rem` |
| `--fc-tooltip-font-size` | `font-size` on content | `0.75rem` |
| `--fc-tooltip-border-radius` | `border-radius` | `var(--fc-radius, 3px)` |
| `--fc-tooltip-max-width` | `max-width` on content | `240px` |
| `--fc-tooltip-delay-open` | open intent delay | `300ms` |
| `--fc-tooltip-delay-close` | close grace period | `100ms` |
| `--fc-tooltip-z-index` | `z-index` | `8000` |

---

## HTML — Classless

```html
<!-- Classless fallback: use the native title attribute -->
<button title="Save your changes">Save</button>
```

---

## HTML — Class-based

```html
<span class="fc-tooltip" data-state="closed">
  <!-- Trigger: any element — button, icon, text -->
  <button
    type="button"
    aria-describedby="tooltip-save"
  >Save</button>

  <!-- Tooltip content: hidden until open -->
  <div
    class="fc-tooltip__content"
    id="tooltip-save"
    role="tooltip"
    hidden
  >
    Save your changes (Ctrl+S)
    <div class="fc-tooltip__arrow"></div>
  </div>
</span>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Tooltip — APG](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) |
| **Role(s)** | `role="tooltip"` on content |
| **Required attributes** | `aria-describedby` on trigger pointing to tooltip `id`; unique `id` on content |
| **Contrast** | Meets WCAG 2.2 AA — ink-on-paper inverted (paper text on ink background) for default tooltip |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Focus trigger → tooltip opens |
| `Escape` | Close tooltip without moving focus away from trigger |
| Blur from trigger | Tooltip closes |

---

## Behavior

**Native element / API used:** — (Floating UI for positioning)

**Machine responsibilities:**
- Open tooltip after `--fc-tooltip-delay-open` ms on `mouseenter` or `focus` on trigger (intent delay prevents flicker during mouse movement)
- Close after `--fc-tooltip-delay-close` ms grace period on `mouseleave` or `blur`
- Close immediately on `Escape` keydown
- Floating UI: position content relative to trigger (default: top; flip/shift to stay in viewport)
- Update `data-state` on root; toggle `hidden` on content
- Emit `fc:open`, `fc:close`

**`@foolscap/core` API sketch:**

```ts
createTooltip(options?: {
  placement?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  openDelay?: number
  closeDelay?: number
}): {
  getTriggerProps(): Record<string, unknown>
  getContentProps(): Record<string, unknown>
  state: {
    open: boolean
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:open` | `{}` | Tooltip becomes visible |
| `fc:close` | `{}` | Tooltip is hidden |

---

## Notes

- Tooltips must NOT contain interactive elements (links, buttons). Use Popover for interactive content
- The tooltip content should be supplementary — never the only way to convey critical information
- `aria-describedby` (not `aria-labelledby`) is correct; tooltips supplement the accessible name, they don't replace it
- `hidden` attribute is used for hiding the content (not `visibility: hidden` or `display: none` via CSS class) so it's removed from the accessibility tree when closed
- Do not use tooltips on elements that are not focusable — keyboard users can't trigger them

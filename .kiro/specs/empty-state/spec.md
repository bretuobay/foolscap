# Empty State

> An indication that there is no data to display in the current view, often including an alternative action.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<div>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-empty-state` | Centered container |
| `icon` | `<span>` | `.fc-empty-state__icon` | Optional icon or illustration slot |
| `title` | `<p>` | `.fc-empty-state__title` | Short heading (not a heading element; use if no semantic heading needed) |
| `description` | `<p>` | `.fc-empty-state__description` | Explanatory text |
| `action` | `<div>` | `.fc-empty-state__action` | Slot for Button or Link |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-empty-state-max-width` | `max-width` | `24rem` |
| `--fc-empty-state-gap` | `gap` between parts | `var(--fc-space-3)` |
| `--fc-empty-state-icon-size` | `font-size` on icon | `3rem` |
| `--fc-empty-state-color` | `color` on description | `var(--ink-muted)` |

---

## HTML — Classless

```html
<div>
  <p>No results found</p>
  <p>Try adjusting your search or filters.</p>
  <a href="/new">Create your first item</a>
</div>
```

---

## HTML — Class-based

```html
<div class="fc-empty-state">
  <span class="fc-empty-state__icon" aria-hidden="true"><!-- icon --></span>
  <p class="fc-empty-state__title">No messages yet</p>
  <p class="fc-empty-state__description">Start a conversation to see your messages here.</p>
  <div class="fc-empty-state__action">
    <a class="fc-button" href="/new-message" data-variant="primary">New message</a>
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<div>` is neutral; content is read as plain text |
| **Required attributes** | None; ensure the surrounding context (e.g. a live region) announces when the empty state appears dynamically |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- If the empty state replaces a list that was previously populated, wrap the container in `aria-live="polite"` so screen readers announce the change.
- The `title` part is a `<p>`, not a heading — use a real `<h2>`/`<h3>` if there is a need for sectioning semantics.
- Icon/illustration slot is decorative; keep `aria-hidden="true"`.

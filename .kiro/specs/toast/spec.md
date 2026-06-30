# Toast

> An alert appearing in a layer above other content, similar to a push notification.
> **Tier:** 3 — Headless machine
> **Also known as:** Snackbar
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `region` | `<div>` | `.fc-toast-region` | Always in DOM; `aria-live` region; fixed-positioned |
| `toast` | `<div>` | `.fc-toast` | Individual notification; added/removed from region |
| `title` | `<p>` | `.fc-toast__title` | Short message headline (optional) |
| `description` | `<p>` | `.fc-toast__description` | Supporting text |
| `action` | `<button>` | `.fc-toast__action` | Optional action button (e.g. "Undo") |
| `close` | `<button>` | `.fc-toast__close` | Manual dismiss button |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Animation phase | `data-state` | `"entering"` · `"visible"` · `"leaving"` | `toast` |
| Notification type | `data-type` | `"info"` · `"success"` · `"warning"` · `"error"` | `toast` |
| Paused timer | `data-state` | `"paused"` | `toast` (while hovered/focused) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-toast-width` | `width` on toast | `360px` |
| `--fc-toast-padding` | `padding` on toast | `1rem` |
| `--fc-toast-gap` | `gap` between stacked toasts | `0.5rem` |
| `--fc-toast-bg` | `background` on toast | `var(--paper-raised)` |
| `--fc-toast-border` | `border` on toast | `1px solid var(--grey-200)` |
| `--fc-toast-shadow` | `box-shadow` on toast | paper-cut elevation token |
| `--fc-toast-border-radius` | `border-radius` | `var(--fc-radius, 4px)` |
| `--fc-toast-z-index` | `z-index` on region | `9000` |
| `--fc-toast-offset` | distance from viewport edge | `1.5rem` |
| `--fc-toast-duration` | default auto-dismiss ms | `5000` |

---

## HTML — Classless

```html
<!-- No meaningful classless fallback — requires JS queue management.
     For no-JS: use a static <div role="alert"> inline in the page instead. -->
<div role="alert">
  <p>File saved successfully.</p>
</div>
```

---

## HTML — Class-based

```html
<!-- Region: always present in DOM, empty when no toasts are visible -->
<div
  class="fc-toast-region"
  aria-live="assertive"
  aria-atomic="false"
  aria-label="Notifications"
  data-position="bottom-right"
>
  <!-- Individual toast (injected by JS) -->
  <div class="fc-toast" data-state="visible" data-type="success">
    <p class="fc-toast__title">Saved</p>
    <p class="fc-toast__description">Your changes have been saved.</p>
    <button class="fc-toast__action" type="button">Undo</button>
    <button class="fc-toast__close" type="button" aria-label="Dismiss notification">×</button>
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Alert — APG](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) |
| **Role(s)** | `aria-live="assertive"` + `aria-atomic="false"` on region; toasts themselves need no additional role inside a live region |
| **Required attributes** | `aria-live` on region; `aria-label` on region for screen-reader landmark; `aria-label` on close button |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Tab` | Moves focus to toast action/close buttons when a toast is visible |
| `Escape` | Dismisses focused (or most recent) toast |
| Focus on toast | Pauses auto-dismiss timer |
| Blur from toast | Resumes auto-dismiss timer |

---

## Behavior

**Native element / API used:** —

**Machine responsibilities:**
- Maintain a toast queue (array of pending toasts)
- Inject toasts into the `region` element when added
- Start per-toast auto-dismiss timer (configurable duration; default 5 s)
- Pause timer on `mouseenter` or focus within toast; resume on `mouseleave` / blur
- Remove toast after timer expires or explicit dismiss
- Animate entry/exit via `data-state` transitions (`entering` → `visible` → `leaving`)
- Limit visible toasts (default: stack up to 3; older toasts shift out)
- Respect `prefers-reduced-motion`: skip slide animation, keep fade only

**`@foolscap/core` API sketch:**

```ts
createToaster(options?: {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  limit?: number
}): {
  getRegionProps(): Record<string, unknown>
  add(toast: {
    title?: string
    description: string
    type?: 'info' | 'success' | 'warning' | 'error'
    duration?: number
    action?: { label: string; onClick: () => void }
  }): string  // returns toast id
  dismiss(id: string): void
  dismissAll(): void
  state: {
    toasts: Toast[]
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:toast-add` | `{ id, type, description }` | Toast is added to queue |
| `fc:toast-dismiss` | `{ id }` | Toast is removed (timer or manual) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-type` | `info` · `success` · `warning` · `error` | Adds a left-border accent rule in the appropriate grey/ink shade; icon slot |
| `data-position` | `bottom-right` (default) · `top-right` · `top-center` · `bottom-center` · etc. | Controls `region` fixed position |

---

## Notes

- The `region` element must be present in the DOM before any toasts are added — mount it once at the app root, not per-component
- `aria-live="assertive"` interrupts screen readers; use `"polite"` for non-critical informational toasts
- Do not move keyboard focus to toasts — they are non-modal and focus should stay where it was
- Action buttons (e.g. "Undo") should be reachable by Tab but not receive auto-focus

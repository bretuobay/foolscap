# Popover

> An element that pops up over other content; usually click-triggered and can contain interactive elements.
> **Tier:** 2 — Platform + shim
> **Also known as:** —
> **Native element:** Popover API (`popover` attribute + `popovertarget`)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `trigger` | `<button>` | `.fc-popover__trigger` | Opens / closes the popover; `popovertarget` attribute links to root |
| `root` | `<div>` | `.fc-popover` | The floating content; carries `popover="auto"` and `data-state` |
| `arrow` | `<span>` | `.fc-popover__arrow` | Optional CSS arrow pointing to trigger |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Open / closed | `data-state` | `open` · `closed` | `root` |
| Placement | `data-placement` | `top` · `bottom` · `left` · `right` | `root` (set by Floating UI) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-popover-width` | `width` on root | `16rem` |
| `--fc-popover-padding` | `padding` on root | `0.75rem 1rem` |
| `--fc-popover-border` | `border` on root | `1px solid var(--ink)` at 12% opacity |
| `--fc-popover-border-radius` | `border-radius` on root | `4px` |
| `--fc-popover-shadow` | `box-shadow` on root | `0 2px 8px rgba(26,26,26,0.10)` |
| `--fc-popover-arrow-size` | width / height of arrow | `0.5rem` |
| `--fc-popover-z-index` | `z-index` on root | `100` |

---

## HTML — Classless

```html
<!-- Native Popover API — zero JS in supporting browsers -->
<button popovertarget="pop-1">More info</button>
<div popover id="pop-1">
  <p>This is a popover. Click outside or press Escape to close.</p>
</div>
```

---

## HTML — Class-based

```html
<button
  class="fc-popover__trigger fc-button"
  data-variant="ghost"
  popovertarget="pop-2"
  aria-haspopup="true"
  aria-expanded="false"
  aria-controls="pop-2"
>
  More info
</button>

<div
  class="fc-popover"
  id="pop-2"
  popover="auto"
  data-state="closed"
  data-placement="bottom"
  role="dialog"
  aria-label="Additional information"
>
  <span class="fc-popover__arrow" aria-hidden="true"></span>
  <p>This is a popover with interactive content.</p>
  <a href="/learn-more">Learn more</a>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern for generic popover; use [APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) semantics when popover contains interactive content |
| **Role(s)** | `dialog` (when interactive content is inside); `tooltip` (if read-only, non-interactive — prefer the Tooltip component) |
| **Required attributes** | `aria-haspopup` on trigger; `aria-expanded` on trigger (kept in sync by shim); `aria-controls` on trigger pointing to popover `id`; `aria-label` or `aria-labelledby` on popover when `role="dialog"` |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Toggle popover open / closed (via trigger button) |
| `Escape` | Close popover (native Popover API behavior) |
| `Tab` | Move focus into popover content when open |
| `Shift + Tab` | Move focus back to trigger or previous element |

---

## Behavior

**Native element / API used:** Popover API (`popover="auto"` attribute) — auto-dismisses when clicking outside or pressing Escape natively in supporting browsers.

**Shim responsibilities:**
- **Floating UI positioning:** After the popover opens, run Floating UI to compute and apply `top`/`left` CSS on the popover, anchored to the trigger. Apply `flip` and `shift` middlewares to keep it in-viewport. Set `data-placement` to the resolved side.
- **`aria-expanded` sync:** Toggle `aria-expanded` on the trigger to match the popover's open state.
- **Browser fallback:** For browsers without Popover API support, manage `hidden` attribute manually on open/close and wire `click` + `Escape` handlers.
- **Emit** `fc:open` when popover opens, `fc:close` when it closes.

**`@foolscap/core` API sketch:**

```ts
createPopover(options?: {
  placement?: 'top' | 'bottom' | 'left' | 'right'  // default: 'bottom'
  offset?: number                                     // px gap between trigger and popover; default: 8
}): {
  getTriggerProps(): Record<string, unknown>
  getPopoverProps(): Record<string, unknown>
  state: { open: boolean; placement: string }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:open` | `{}` | After popover becomes visible |
| `fc:close` | `{}` | After popover is dismissed (any method) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm` · `md` · `lg` | Adjusts `--fc-popover-width` and padding |

---

## Notes

- The Popover API's `popover="auto"` provides light-dismiss (click outside closes) and Escape handling natively. The shim adds only positioning and fallback support.
- For **read-only** brief descriptions, prefer the Tooltip component (hover/focus-intent triggered, non-interactive). Popover is for interactive or richer content.
- `popover="manual"` can be used when the consumer wants to control open/close entirely without light-dismiss; the shim handles this via the `mode` option (future expansion).
- Arrow positioning must be updated by Floating UI's `arrow` middleware on every recompute.
- Future expansion: nested popovers, `popover="manual"` mode, `offset` and `arrow` tokens.

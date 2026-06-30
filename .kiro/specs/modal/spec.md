# Modal

> An interface element appearing over other content, requiring interaction before returning to what is underneath.
> **Tier:** 2 — Platform + shim
> **Also known as:** Dialog, Popup, Modal window
> **Native element:** `<dialog>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<dialog>` | `.fc-modal` | Native dialog; carries `data-state` |
| `header` | `<div>` | `.fc-modal__header` | Optional; contains title and close button |
| `title` | `<h2>` | `.fc-modal__title` | Labels the dialog via `aria-labelledby` |
| `close` | `<button>` | `.fc-modal__close` | Icon button in header; closes the modal |
| `body` | `<div>` | `.fc-modal__body` | Main content area; scrolls independently |
| `footer` | `<div>` | `.fc-modal__footer` | Optional; contains action buttons |
| `backdrop` | `::backdrop` | — | Native CSS pseudo-element on `<dialog>` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Open / closed | `data-state` | `open` · `closed` | `root` |

> The native `open` attribute on `<dialog>` is the source of truth; `data-state` mirrors it for CSS targeting.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-modal-width` | `max-width` on root | `32rem` |
| `--fc-modal-padding` | `padding` on body | `1.5rem` |
| `--fc-modal-header-padding` | `padding` on header | `1rem 1.5rem` |
| `--fc-modal-footer-padding` | `padding` on footer | `1rem 1.5rem` |
| `--fc-modal-border-radius` | `border-radius` on root | `4px` |
| `--fc-modal-shadow` | `box-shadow` on root | `0 2px 8px rgba(26,26,26,0.12)` |
| `--fc-modal-backdrop-color` | `background` on `::backdrop` | `rgba(26,26,26,0.4)` |

---

## HTML — Classless

```html
<!-- Trigger -->
<button onclick="document.getElementById('my-dialog').showModal()">Open dialog</button>

<!-- Dialog -->
<dialog id="my-dialog">
  <h2>Dialog title</h2>
  <p>Dialog content goes here.</p>
  <form method="dialog">
    <button>Close</button>
  </form>
</dialog>
```

---

## HTML — Class-based

```html
<!-- Trigger (managed by shim) -->
<button class="fc-button" data-variant="primary" aria-haspopup="dialog" id="modal-trigger">
  Open modal
</button>

<!-- Modal -->
<dialog
  class="fc-modal"
  id="modal-1"
  aria-labelledby="modal-1-title"
  data-state="closed"
>
  <div class="fc-modal__header">
    <h2 class="fc-modal__title" id="modal-1-title">Modal title</h2>
    <button class="fc-modal__close" aria-label="Close modal">
      <svg aria-hidden="true"><!-- × icon --></svg>
    </button>
  </div>

  <div class="fc-modal__body">
    <p>Modal body content.</p>
  </div>

  <div class="fc-modal__footer">
    <button class="fc-button" data-variant="primary">Confirm</button>
    <button class="fc-button" data-variant="ghost">Cancel</button>
  </div>
</dialog>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) |
| **Role(s)** | `dialog` (implicit on `<dialog>`); `alertdialog` variant for destructive confirmations |
| **Required attributes** | `aria-labelledby` on `<dialog>` pointing to title `id`; `aria-label` on close button; `aria-haspopup="dialog"` on trigger |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Escape` | Close the modal and restore focus to trigger (native `<dialog>` behavior) |
| `Tab` | Move focus forward within the modal (focus trapped inside) |
| `Shift + Tab` | Move focus backward within the modal |
| `Enter` / `Space` | Activate focused button |

---

## Behavior

**Native element / API used:** `<dialog>` — `showModal()` opens with native focus trap and Escape handling; `close()` dismisses.

**Shim responsibilities:**
- **Open:** Call `dialog.showModal()` and set `data-state="open"`. Store a reference to the element that triggered the modal.
- **Backdrop click to close:** Listen for `click` on the `<dialog>` element. If `event.target === dialog` (i.e. click landed on the backdrop outside the content box), call `dialog.close()`.
- **Focus restoration:** On the native `close` event, move focus back to the stored trigger element.
- **Scroll lock:** Toggle `overflow: hidden` on `<body>` while the modal is open (the native `<dialog>` does not do this automatically).
- **State sync:** On `open` / `close` events, update `data-state` on root.
- **Dispatch** `fc:open` on open, `fc:close` on close.

**`@foolscap/core` API sketch:**

```ts
createModal(options?: {
  initialOpen?: boolean
  onClose?: () => void
}): {
  getDialogProps(): Record<string, unknown>
  getCloseButtonProps(): Record<string, unknown>
  state: { open: boolean }
  open(): void
  close(): void
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:open` | `{}` | After `showModal()` is called |
| `fc:close` | `{ returnValue: string }` | After `<dialog>` closes (any method) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `default` · `alert` | `alert` applies `role="alertdialog"` and `aria-describedby` |
| `data-size` | `sm` · `md` · `lg` · `full` | Adjusts `--fc-modal-width`; `full` = fullscreen |

---

## Notes

- `<form method="dialog">` inside the dialog is a zero-JS close pattern; the `returnValue` is set to the value of the submit button.
- The native `<dialog>` focus trap covers all browsers that support it; a polyfill (`a11y-dialog` or similar) is recommended for older targets.
- For non-modal use (sidebar drawers, etc.) prefer the Drawer component which uses `dialog.show()` instead of `showModal()`.
- Future expansion: stacked modals (z-index management), slide / fade entrance animation, `aria-describedby` for body description.

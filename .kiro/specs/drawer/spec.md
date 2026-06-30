# Drawer

> A panel which slides out from the edge of the screen.
> **Tier:** 3 — Headless machine
> **Also known as:** Tray, Flyout, Sheet
> **Native element:** `<dialog>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-drawer` | Outer wrapper; carries `data-state` and `data-side` |
| `overlay` | `<div>` | `.fc-drawer__overlay` | Backdrop; click to dismiss |
| `panel` | `<dialog>` | `.fc-drawer__panel` | The sliding surface; `aria-modal="true"` |
| `header` | `<div>` | `.fc-drawer__header` | Title area |
| `title` | `<h2>` | `.fc-drawer__title` | Drawer heading; `id` referenced by `aria-labelledby` |
| `body` | `<div>` | `.fc-drawer__body` | Scrollable content area |
| `footer` | `<div>` | `.fc-drawer__footer` | Action buttons (optional) |
| `close` | `<button>` | `.fc-drawer__close` | Explicit close button |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Open / closed | `data-state` | `open \| closed` | `root` |
| Side | `data-side` | `left \| right \| top \| bottom` | `root` |
| Modal | `aria-modal` | `true` | `panel` |
| Labelled by | `aria-labelledby` | `[title id]` | `panel` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-drawer-width` | `width` on `panel` (left/right) | `320px` |
| `--fc-drawer-height` | `height` on `panel` (top/bottom) | `50vh` |
| `--fc-drawer-panel-bg` | `background` on `panel` | `var(--paper-raised)` |
| `--fc-drawer-overlay-bg` | `background` on `overlay` | `rgb(0 0 0 / 0.4)` |
| `--fc-drawer-animation-duration` | `transition-duration` | `200ms` |
| `--fc-drawer-panel-border` | `border` on `panel` (inward-facing edge) | `1px solid var(--ink)` |
| `--fc-drawer-padding` | `padding` on `header`, `body`, `footer` | `var(--fc-space-4)` |

---

## HTML — Classless

```html
<!-- No native equivalent for a slide-in drawer.
     Classless fallback renders as a visible full-panel with no animation. -->
<dialog open aria-labelledby="drawer-title">
  <h2 id="drawer-title">Panel title</h2>
  <p>Panel content.</p>
  <form method="dialog">
    <button>Close</button>
  </form>
</dialog>
```

---

## HTML — Class-based

```html
<div class="fc-drawer" data-state="open" data-side="right">
  <div class="fc-drawer__overlay" aria-hidden="true"></div>
  <dialog
    class="fc-drawer__panel"
    aria-modal="true"
    aria-labelledby="drawer-title-1"
    open
  >
    <div class="fc-drawer__header">
      <h2 class="fc-drawer__title" id="drawer-title-1">Settings</h2>
      <button class="fc-drawer__close" aria-label="Close drawer">✕</button>
    </div>
    <div class="fc-drawer__body">
      <!-- scrollable content -->
    </div>
    <div class="fc-drawer__footer">
      <button>Save</button>
    </div>
  </dialog>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Dialog Modal (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) |
| **Role(s)** | `dialog` (native `<dialog>` element) |
| **Required attributes** | `aria-modal="true"` on panel; `aria-labelledby` pointing to `title` `id` |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

**Keyboard interaction**

| Key | Action |
|-----|--------|
| `Escape` | Close drawer; return focus to trigger |
| `Tab` | Move focus to next focusable element within drawer (focus trapped) |
| `Shift+Tab` | Move focus to previous focusable element within drawer (focus trapped) |

---

## Behavior

**Native element / API used:** Native `<dialog>` element (`dialog.showModal()` / `dialog.close()`).

**Machine responsibilities:**
- Open: call `dialog.showModal()`, move focus to first focusable element in panel (or `close` button), lock body scroll
- Close: call `dialog.close()`, restore focus to the element that triggered open, unlock body scroll
- Focus trap: intercept `Tab` / `Shift+Tab` to cycle within focusable elements inside `panel`
- Overlay click: detect `pointerdown` on `overlay` → close
- Escape key: native `<dialog>` handles `Escape` → `close` event; wire to machine close
- Animation: set `data-state="open"` before opening (for CSS enter transition); set `data-state="closed"` then wait for transition end before removing from DOM / hiding
- Emit `fc:open` on open, `fc:close` on close

**`@foolscap/core` API sketch:**

```ts
createDrawer(options?: {
  side?: 'left' | 'right' | 'top' | 'bottom'  // default: 'right'
  defaultOpen?: boolean
}): {
  getTriggerProps(): Record<string, unknown>
  getRootProps(): Record<string, unknown>
  getOverlayProps(): Record<string, unknown>
  getPanelProps(): Record<string, unknown>
  getCloseProps(): Record<string, unknown>
  open(): void
  close(): void
  state: {
    isOpen: boolean
    side: 'left' | 'right' | 'top' | 'bottom'
  }
}
```

**Custom events emitted:**

| Event | Detail payload | When fired |
|-------|---------------|------------|
| `fc:open` | `{}` | Drawer finishes opening |
| `fc:close` | `{}` | Drawer finishes closing |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-side` | `left \| right \| top \| bottom` | Controls which edge the panel slides from |
| `data-size` | `sm \| md \| lg` | Adjusts `--fc-drawer-width` / `--fc-drawer-height` |

---

## Notes

- `<dialog>` native focus management and `Escape` handling simplify the shim considerably; prefer it over `div[role="dialog"]`.
- Body scroll lock: add `overflow: hidden` to `<body>` on open; remove on close. Account for scrollbar width to prevent layout shift.
- The `overlay` is `aria-hidden="true"` — screen reader users interact only with the `panel` content.
- Nested drawers (drawer inside drawer) are not supported in v1.
- Future: `data-dismissable="false"` to disable overlay-click and Escape dismiss for confirmation-required flows.

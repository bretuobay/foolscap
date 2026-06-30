# Progress Bar

> A horizontal bar indicating the completion status of a long-running task, updated continuously.
> **Tier:** 1 — CSS only
> **Also known as:** Progress
> **Native element:** `<progress>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-progress-bar` | Wrapper; provides track styling |
| `track` | `<div>` | `.fc-progress-bar__track` | Background track |
| `fill` | `<div>` | `.fc-progress-bar__fill` | Filled portion; width set via inline style |
| `label` | `<span>` | `.fc-progress-bar__label` | Optional visible or visually-hidden label |

> In classless mode, use the native `<progress>` element directly; the stylesheet styles it. In class-based mode a `<div>`-based implementation allows full cross-browser visual control.

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Indeterminate | `data-state` | `indeterminate` | `root` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-progress-bar-height` | `height` on track | `0.375rem` |
| `--fc-progress-bar-radius` | `border-radius` on track/fill | `0` |
| `--fc-progress-bar-track-color` | `background-color` on track | `var(--grey-200)` |
| `--fc-progress-bar-fill-color` | `background-color` on fill | `var(--ink)` |
| `--fc-progress-bar-duration` | animation duration (indeterminate) | `1.4s` |

---

## HTML — Classless

```html
<!-- Determinate -->
<label for="upload-progress">Uploading file…</label>
<progress id="upload-progress" value="65" max="100">65%</progress>

<!-- Indeterminate -->
<label for="loading">Loading…</label>
<progress id="loading">Loading…</progress>
```

---

## HTML — Class-based

```html
<!-- Determinate: 65% complete -->
<div class="fc-progress-bar" role="progressbar"
     aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"
     aria-label="Upload progress">
  <div class="fc-progress-bar__track">
    <div class="fc-progress-bar__fill" style="width: 65%;"></div>
  </div>
  <span class="fc-visually-hidden">65% complete</span>
</div>

<!-- Indeterminate -->
<div class="fc-progress-bar" data-state="indeterminate"
     role="progressbar" aria-label="Loading">
  <div class="fc-progress-bar__track">
    <div class="fc-progress-bar__fill"></div>
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern (uses `role="progressbar"`) |
| **Role(s)** | `role="progressbar"` on root (explicit when using `<div>`); native `<progress>` carries implicit role |
| **Required attributes** | `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on `<div>` implementation; `aria-label` or `aria-labelledby`; omit `aria-valuenow` for indeterminate |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- The indeterminate CSS animation (shimmer or sliding fill) must respect `prefers-reduced-motion: reduce` — disable or use a simple opacity pulse.
- Native `<progress>` styling is limited in WebKit; the `<div>`-based class variant gives full control.
- For a step-by-step progress tracker (multi-step flow), see the Progress Indicator (Stepper) spec.

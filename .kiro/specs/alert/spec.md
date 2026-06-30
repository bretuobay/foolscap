# Alert

> A way of informing the user of important changes in a prominent way.
> **Tier:** 1 — CSS only
> **Also known as:** Notification, Feedback, Message, Banner, Callout
> **Native element:** `<div>` with ARIA live role

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-alert` | Carries `role` and `data-variant` |
| `icon` | `<span>` | `.fc-alert__icon` | Optional; icon slot |
| `content` | `<div>` | `.fc-alert__content` | Contains title and description |
| `title` | `<p>` | `.fc-alert__title` | Optional bold heading |
| `description` | `<p>` | `.fc-alert__description` | Main message text |
| `dismiss` | `<button>` | `.fc-alert__dismiss` | Optional dismiss button |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Dismissing | `data-state` | `dismissing` | `root` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-alert-border` | `border` | `1px solid var(--ink)` |
| `--fc-alert-padding` | `padding` | `var(--fc-space-4)` |
| `--fc-alert-radius` | `border-radius` | `0` |
| `--fc-alert-gap` | `gap` | `var(--fc-space-3)` |

---

## HTML — Classless

```html
<!-- Assertive: announced immediately by screen readers -->
<div role="alert">
  <strong>Error:</strong> Your session has expired. Please sign in again.
</div>

<!-- Polite: announced when the user is idle -->
<div role="status">
  File uploaded successfully.
</div>
```

---

## HTML — Class-based

```html
<div class="fc-alert" role="alert" data-variant="error">
  <span class="fc-alert__icon" aria-hidden="true"><!-- icon --></span>
  <div class="fc-alert__content">
    <p class="fc-alert__title">Session expired</p>
    <p class="fc-alert__description">Please sign in again to continue.</p>
  </div>
  <button class="fc-alert__dismiss" aria-label="Dismiss alert" type="button">×</button>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [ARIA Live Regions](https://www.w3.org/WAI/ARIA/apg/patterns/alert/) |
| **Role(s)** | `role="alert"` (assertive) or `role="status"` (polite) on `root` |
| **Required attributes** | `role` on `root`; `aria-label` on dismiss button |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `info` · `success` · `warning` · `error` | Border/icon colour; expressed via `--ink` variants at differing opacity in default paper theme |
| `data-live` | `assertive` · `polite` | Maps to `role="alert"` vs `role="status"`; set by author |

---

## Notes

- The paper theme does not use colour to solely convey variant type; pair each variant with an icon or text prefix (e.g. "Error:", "Warning:") for WCAG 1.4.1 compliance.
- Dismiss animation is CSS-only (`data-state="dismissing"` → opacity/height transition). JS sets the attribute; no core machine needed.
- For persistent page-level alerts (e.g. banners), use `<aside>` instead of a live-region `<div>`.

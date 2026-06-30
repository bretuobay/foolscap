# Button

> Buttons trigger an action such as submitting a form or showing/hiding an interface component.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<button>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<button>` | `.fc-button` | `type="button"` default; `type="submit"` in forms |
| `icon-start` | `<span>` | `.fc-button__icon-start` | Optional leading icon slot |
| `label` | `<span>` | `.fc-button__label` | Text content |
| `icon-end` | `<span>` | `.fc-button__icon-end` | Optional trailing icon slot |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Loading | `data-state` | `loading` | `root` |

> CSS `:disabled` covers the disabled state. `data-state="loading"` adds a spinner and sets `aria-disabled="true"` without removing the element from tab order.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-button-padding` | `padding` | `0.5em 1.25em` |
| `--fc-button-radius` | `border-radius` | `0` |
| `--fc-button-border` | `border` | `1px solid var(--ink)` |
| `--fc-button-font-size` | `font-size` | `inherit` |
| `--fc-button-font-weight` | `font-weight` | `500` |
| `--fc-button-gap` | `gap` (icon spacing) | `0.5em` |
| `--fc-button-min-height` | `min-height` | `2.75rem` (44px touch target) |

---

## HTML — Classless

```html
<button type="button">Save changes</button>

<button type="submit">Submit</button>
```

---

## HTML — Class-based

```html
<!-- Primary -->
<button class="fc-button" type="button" data-variant="primary">
  <span class="fc-button__label">Save changes</span>
</button>

<!-- With leading icon -->
<button class="fc-button" type="button" data-variant="secondary" data-size="sm">
  <span class="fc-button__icon-start" aria-hidden="true"><!-- icon --></span>
  <span class="fc-button__label">Download</span>
</button>

<!-- Loading state -->
<button class="fc-button" type="button" data-state="loading" aria-disabled="true">
  <span class="fc-button__label">Saving…</span>
</button>

<!-- Disabled -->
<button class="fc-button" type="button" disabled data-variant="primary">
  <span class="fc-button__label">Unavailable</span>
</button>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| **Role(s)** | Inherited (`<button>` is implicit `button` role) |
| **Required attributes** | Visible label or `aria-label`; `type` attribute always set |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `primary` · `secondary` · `ghost` · `danger` | `primary`: ink bg, paper text; `secondary`: paper bg, ink border+text; `ghost`: no border/bg until hover; `danger`: strong ink border, danger text colour |
| `data-size` | `sm` · `md` · `lg` | Adjusts `--fc-button-padding` and `font-size` |

---

## Notes

- Always use `<button>`, not `<div role="button">`. Never use `<a>` for an action — only for navigation.
- Icon-only buttons must include `aria-label` on the root and set the icon `aria-hidden="true"`.
- `data-state="loading"` shows a Spinner inside the button via CSS `::after` pseudo-element or injected via a lightweight JS call; no core machine required.
- Minimum touch target (44×44px) enforced by `--fc-button-min-height`; width expands naturally from content.

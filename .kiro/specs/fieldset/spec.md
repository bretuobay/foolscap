# Fieldset

> A wrapper for related form fields.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<fieldset>` + `<legend>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<fieldset>` | `.fc-fieldset` | Groups related inputs |
| `legend` | `<legend>` | `.fc-fieldset__legend` | Names the group |
| `hint` | `<p>` | `.fc-fieldset__hint` | Optional group-level helper text |
| `fields` | `<div>` | `.fc-fieldset__fields` | Optional wrapper for layout of child inputs |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-fieldset-border` | `border` on root | `1px solid var(--grey-300)` |
| `--fc-fieldset-padding` | `padding` on root | `var(--fc-space-4)` |
| `--fc-fieldset-gap` | `gap` on fields wrapper | `var(--fc-space-3)` |
| `--fc-fieldset-legend-font-size` | `font-size` on legend | `0.875rem` |
| `--fc-fieldset-legend-font-weight` | `font-weight` on legend | `600` |

---

## HTML — Classless

```html
<fieldset>
  <legend>Shipping address</legend>
  <label for="street">Street</label>
  <input type="text" id="street" name="street">
  <label for="city">City</label>
  <input type="text" id="city" name="city">
</fieldset>
```

---

## HTML — Class-based

```html
<fieldset class="fc-fieldset">
  <legend class="fc-fieldset__legend">Shipping address</legend>
  <p class="fc-fieldset__hint">All fields are required.</p>
  <div class="fc-fieldset__fields">
    <div class="fc-text-input">
      <label class="fc-text-input__label" for="street">Street</label>
      <input class="fc-text-input__input" type="text" id="street" name="street">
    </div>
    <div class="fc-text-input">
      <label class="fc-text-input__label" for="city">City</label>
      <input class="fc-text-input__input" type="text" id="city" name="city">
    </div>
  </div>
</fieldset>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern (native HTML semantics) |
| **Role(s)** | `<fieldset>` has implicit `group` role; `<legend>` names it |
| **Required attributes** | `<legend>` must be present (first child of `<fieldset>`) |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- Always use `<fieldset>` + `<legend>` for groups of radio buttons or checkboxes — screen readers announce the legend before each input in the group.
- The border on `<fieldset>` is reset to a hairline; the native browser border styling is replaced via CSS.
- Use the Stack or Fields layout primitive inside `fc-fieldset__fields` for consistent vertical rhythm.

# Text Input

> A single-line text field for capturing user input.
> **Tier:** 1 — CSS only
> **Also known as:** Input, Text field, Input field
> **Native element:** `<input type="text">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-text-input` | Wrapper; carries `data-state` |
| `label` | `<label>` | `.fc-text-input__label` | Always visible; associated via `for` |
| `hint` | `<p>` | `.fc-text-input__hint` | Helper text below the field |
| `input` | `<input type="text">` | `.fc-text-input__input` | The native input |
| `prefix` | `<span>` | `.fc-text-input__prefix` | Optional leading slot (icon/text, `aria-hidden`) |
| `suffix` | `<span>` | `.fc-text-input__suffix` | Optional trailing slot (icon/text, `aria-hidden`) |
| `error` | `<p>` | `.fc-text-input__error` | Error message; `role="alert"` or linked via `aria-describedby` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Validation | `data-state` | `idle` · `error` · `success` | `root` |
| Disabled | native `disabled` on input | — | `input` |
| Read-only | native `readonly` on input | — | `input` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-text-input-border` | `border` | `1px solid var(--ink)` |
| `--fc-text-input-radius` | `border-radius` | `0` |
| `--fc-text-input-padding` | `padding` on input | `0.5rem 0.75rem` |
| `--fc-text-input-font-size` | `font-size` | `1rem` |
| `--fc-text-input-bg` | `background-color` | `var(--paper)` |
| `--fc-text-input-color` | `color` | `var(--ink)` |
| `--fc-text-input-focus-ring` | `outline` on focus | `2px solid var(--ink)` |
| `--fc-text-input-error-border` | `border-color` in error state | `var(--ink)` + underline pattern |
| `--fc-text-input-disabled-opacity` | `opacity` when disabled | `0.45` |

---

## HTML — Classless

```html
<label for="full-name">Full name</label>
<input type="text" id="full-name" name="full_name" autocomplete="name" required>
```

---

## HTML — Class-based

```html
<!-- Default -->
<div class="fc-text-input">
  <label class="fc-text-input__label" for="full-name">Full name</label>
  <p class="fc-text-input__hint" id="full-name-hint">As it appears on your passport.</p>
  <input class="fc-text-input__input" type="text" id="full-name" name="full_name"
         aria-describedby="full-name-hint" autocomplete="name" required>
</div>

<!-- Error state -->
<div class="fc-text-input" data-state="error">
  <label class="fc-text-input__label" for="email">Email address</label>
  <input class="fc-text-input__input" type="email" id="email" name="email"
         aria-describedby="email-error" aria-invalid="true"
         autocomplete="email" value="not-an-email">
  <p class="fc-text-input__error" id="email-error" role="alert">
    Enter a valid email address.
  </p>
</div>

<!-- With prefix and suffix -->
<div class="fc-text-input">
  <label class="fc-text-input__label" for="price">Price</label>
  <div class="fc-text-input__wrapper">
    <span class="fc-text-input__prefix" aria-hidden="true">£</span>
    <input class="fc-text-input__input" type="number" id="price" name="price"
           min="0" step="0.01">
    <span class="fc-text-input__suffix" aria-hidden="true">GBP</span>
  </div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<input type="text">` has implicit `textbox` role |
| **Required attributes** | `<label>` + `for`/`id` association always; `aria-describedby` when hint or error exists; `aria-invalid="true"` + `aria-describedby` pointing to error message in error state |
| **Contrast** | Text must meet WCAG 2.2 AA (4.5:1); input border vs background must meet 3:1 non-text contrast |

---

## Variants & Modifiers

| `type` value | Notes |
|---|---|
| `text` | Default |
| `email` | Email-specific keyboard on mobile; use `autocomplete="email"` |
| `tel` | Numeric keyboard on mobile; use `autocomplete="tel"` |
| `url` | URL-specific keyboard; use `autocomplete="url"` |
| `number` | Numeric keyboard; restrict with `min`/`max`/`step` |
| `password` | Masked; add a show/hide toggle button beside the input |

---

## Notes

- Prefix/suffix elements are `aria-hidden="true"` because their meaning should be captured in the label, `aria-label`, or placeholder when necessary.
- For `type="password"`, the show/hide toggle is a `<button type="button">` with `aria-pressed` and `aria-label="Show password"` / `"Hide password"`.
- Multi-line input → use the Textarea component.
- Input with dropdown suggestions → use the Combobox component (Tier 3).
